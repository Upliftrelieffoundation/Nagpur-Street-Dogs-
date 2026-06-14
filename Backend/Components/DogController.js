import { v2 as cloudinaryV2 } from 'cloudinary';
import supabase from '../Utils/supabase.js';

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * UPLOAD DOG IMAGES — upload multiple images to Cloudinary
 * (Unchanged — still uses Cloudinary)
 */
export const uploadDogImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinaryV2.uploader.upload(base64Image, {
        folder: 'NSD/Dogs',
        timeout: 60000,
      });
      return result.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    res.status(200).json({ message: 'Dog images uploaded successfully.', imageUrls });
  } catch (error) {
    console.error('Error uploading dog images:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET ALL DOGS — with filters and pagination
 * OLD: Dog.find(filter).skip(skip).limit(limit)
 * NEW: supabase.from('dogs').select().range(from, to)
 */
export const getAllDogs = async (req, res) => {
  try {
    const { page = 1, limit = 12, city, breed, size, urgent } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    // Build Supabase query
    let query = supabase
      .from('dogs')
      .select('id, name, breed, age, gender, size, color, images, location_city, location_state, health_vaccinated, health_neutered, urgent, views, created_at', { count: 'exact' })
      .eq('is_adopted', false)
      .order('urgent', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply filters
    if (city && city.trim()) query = query.ilike('location_city', `%${city.trim()}%`);
    if (breed && breed.trim()) query = query.ilike('breed', `%${breed.trim()}%`);
    if (size && size.trim()) query = query.eq('size', size.trim());
    if (urgent === 'true') query = query.eq('urgent', true);

    const { data: dogs, count, error } = await query;

    if (error) throw error;

    const totalDogs = count || 0;
    const totalPages = Math.ceil(totalDogs / parseInt(limit));

    res.json({
      success: true,
      dogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalDogs,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ success: false, message: 'Error fetching dogs', error: error.message });
  }
};

/**
 * GET SINGLE DOG — with owner profile populated
 */
export const getDogById = async (req, res) => {
  try {
    const { data: dog, error } = await supabase
      .from('dogs')
      .select('*, profiles:owner_id(id, name, email, occupation, phone, image)')
      .eq('id', req.params.id)
      .single();

    if (error || !dog) {
      return res.status(404).json({ success: false, message: 'Dog not found' });
    }

    res.json({ success: true, dog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CREATE DOG — list a dog for adoption
 * OLD: new Dog(dogData).save() + User.findByIdAndUpdate($push)
 * NEW: supabase.from('dogs').insert()  (no need to update user — query by owner_id instead)
 */
export const createDog = async (req, res) => {
  try {
    const body = req.body;

    // Check for duplicate name by same owner
    const { data: existing } = await supabase
      .from('dogs')
      .select('id')
      .eq('name', body.name?.trim())
      .eq('owner_id', body.owner)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already listed a dog with this name.' });
    }

    const dogData = {
      name: body.name,
      breed: body.breed,
      age: body.age,
      gender: body.gender,
      size: body.size,
      color: body.color,
      description: body.description,
      images: body.images || [],
      health_vaccinated: body.healthStatus?.vaccinated || false,
      health_neutered: body.healthStatus?.neutered || false,
      health_medical_history: body.healthStatus?.medicalHistory || '',
      location_city: body.location?.city,
      location_state: body.location?.state,
      location_pincode: body.location?.pincode,
      location_address: body.location?.address || null,
      owner_id: body.owner,
      contact_preference: body.contactPreference || 'both',
      urgent: body.urgent || false,
      temperament: body.temperament || [],
      good_with_children: body.goodWith?.children || false,
      good_with_cats: body.goodWith?.cats || false,
      good_with_dogs: body.goodWith?.dogs || false,
      energy_level: body.energyLevel || 'Medium',
      special_needs: body.specialNeeds || '',
      adoption_fee: body.adoptionFee || 0,
    };

    const { data: dog, error } = await supabase.from('dogs').insert(dogData).select().single();

    if (error) throw error;

    res.status(201).json({ success: true, dog });
  } catch (error) {
    console.error('Error creating dog:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE DOG
 */
export const updateDog = async (req, res) => {
  try {
    const { data: existing, error: fetchErr } = await supabase
      .from('dogs').select('owner_id').eq('id', req.params.id).single();

    if (fetchErr || !existing) return res.status(404).json({ success: false, message: 'Dog not found' });
    if (existing.owner_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const { data: dog, error } = await supabase
      .from('dogs').update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();

    if (error) throw error;
    res.json({ success: true, dog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * MARK DOG AS ADOPTED
 */
export const adoptDog = async (req, res) => {
  try {
    const { data: existing } = await supabase.from('dogs').select('owner_id').eq('id', req.params.id).single();
    if (!existing) return res.status(404).json({ success: false, message: 'Dog not found' });
    if (existing.owner_id !== req.user.id) return res.status(403).json({ success: false, message: 'Only owner can mark as adopted' });

    const { error } = await supabase.from('dogs').update({
      is_adopted: true,
      adopted_by: req.body.adoptedBy || null,
      adopted_at: new Date().toISOString(),
    }).eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Dog marked as adopted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE DOG LISTING
 */
export const deleteDog = async (req, res) => {
  try {
    const { data: existing } = await supabase.from('dogs').select('owner_id').eq('id', req.params.id).single();
    if (!existing) return res.status(404).json({ success: false, message: 'Dog not found' });
    if (existing.owner_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const { error } = await supabase.from('dogs').delete().eq('id', req.params.id);
    if (error) throw error;

    res.json({ success: true, message: 'Dog listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET USER'S POSTED DOGS
 */
export const getUserDogs = async (req, res) => {
  try {
    const { data: dogs, error } = await supabase
      .from('dogs').select('*').eq('owner_id', req.user.id).order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, dogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET TRENDING / FEATURED DOGS
 */
export const getTrendingDogs = async (req, res) => {
  try {
    const { data: dogs, error } = await supabase
      .from('dogs')
      .select('*, profiles:owner_id(name, email, phone)')
      .eq('is_adopted', false)
      .order('urgent', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    res.json({ success: true, dogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET DOGS BY BREED
 */
export const getDogsByBreed = async (req, res) => {
  try {
    const { breed } = req.body;
    const { data: dogs, error } = await supabase
      .from('dogs')
      .select('*')
      .ilike('breed', `%${breed}%`)
      .eq('is_adopted', false)
      .order('urgent', { ascending: false });

    if (error) throw error;
    res.json({ success: true, dogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET DOGS BY LOCATION
 */
export const getDogsByLocation = async (req, res) => {
  try {
    const { city, state } = req.body;
    let query = supabase.from('dogs').select('*').eq('is_adopted', false);

    if (city) query = query.ilike('location_city', `%${city}%`);
    if (state) query = query.ilike('location_state', `%${state}%`);

    const { data: dogs, error } = await query.order('urgent', { ascending: false });
    if (error) throw error;
    res.json({ success: true, dogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};