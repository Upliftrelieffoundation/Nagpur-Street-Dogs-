import supabase from '../Utils/supabase.js';
import uploadImageCloudinary from '../Utils/uploadImage.js';

/**
 * REGISTER — Creates a new user in Supabase Auth + inserts profile row.
 * 
 * OLD: manually hashed password with bcryptjs, created MongoDB User document
 * NEW: supabase.auth.signUp() handles password hashing & token creation
 */
export async function Register(req, res) {
  const { name, email, password, confirmPassword, occupation, dob, phone, address } = req.body;
  const file = req.file;

  // Validation
  if (!name || !email || !password || !confirmPassword || !occupation || !phone) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match',
    });
  }

  try {
    // Upload avatar image to Cloudinary if provided
    let imageUrl = null;
    if (file) {
      const uploadResult = await uploadImageCloudinary(file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    // Step 1: Create the user in Supabase Auth (handles password hashing)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,   // stored in auth.users.raw_user_meta_data
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    const userId = authData.user.id;

    // Step 2: Insert the full profile into our profiles table
    // (The trigger auto-creates a minimal row; we upsert with complete data)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        name,
        occupation,
        dob: dob || null,
        phone,
        image: imageUrl,
        address_street: address?.street || null,
        address_city: address?.city || null,
        address_state: address?.state || null,
        address_pincode: address?.pincode || null,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile insert error:', profileError);
      return res.status(500).json({
        success: false,
        message: 'User created but profile setup failed: ' + profileError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to confirm your account.',
      user: {
        id: userId,
        name: profile.name,
        email: profile.email,
        occupation: profile.occupation,
        phone: profile.phone,
        image: profile.image,
      },
      // Note: session token will be null until email is confirmed
      // For instant login without email confirm, disable email confirmation in Supabase Dashboard
      session: authData.session,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}

/**
 * SIGNIN — Email + password login via Supabase Auth.
 * 
 * OLD: User.findOne() + bcryptjs.compare() + jwt.sign()
 * NEW: supabase.auth.signInWithPassword() — Supabase does all the work
 */
export async function Signin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Supabase Auth validates credentials and returns a session with JWT token
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Invalid credentials',
      });
    }

    // Fetch the user's full profile from our profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    return res.status(200).json({
      success: true,
      message: 'User successfully logged in',
      // This is the JWT access token — frontend stores it and sends it with every request
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name,
        image: profile?.image,
        occupation: profile?.occupation,
        phone: profile?.phone,
        address: {
          street: profile?.address_street,
          city: profile?.address_city,
          state: profile?.address_state,
          pincode: profile?.address_pincode,
        },
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * GET USER PROFILE — Fetch a user's public profile by their UUID
 */
export async function getUserProfile(req, res) {
  const { userId } = req.params;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, name, email, occupation, image, phone, address_city, address_state, created_at')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user's blogs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('blog_id, title, banner, published_at, total_likes, total_reads')
      .eq('author_id', userId)
      .eq('draft', false)
      .order('published_at', { ascending: false });

    // Fetch user's dogs for adoption
    const { data: dogs } = await supabase
      .from('dogs')
      .select('id, name, breed, images, is_adopted')
      .eq('owner_id', userId)
      .eq('is_adopted', false);

    return res.json({
      ...profile,
      blogs: blogs || [],
      dogsForAdoption: dogs || [],
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}