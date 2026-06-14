import { Router } from 'express';
import multer from 'multer';
import { Register, Signin, getUserProfile } from '../Components/UserComponents.js';
import supabase from '../Utils/supabase.js';

const userRouter = Router();

// Configure multer for avatar image upload (memory storage → Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/user/register — email + password registration
userRouter.post('/register', upload.single('image'), Register);

// POST /api/user/signin — email + password login
userRouter.post('/signin', Signin);

// GET /api/user/profile/:userId — public profile page
userRouter.get('/profile/:userId', getUserProfile);

/**
 * GET /api/user/google — initiate Google OAuth
 * Returns the Google sign-in URL. Frontend opens it in a new tab/redirect.
 * Supabase handles the callback at: https://<project>.supabase.co/auth/v1/callback
 * After success, user is redirected to VITE_SITE_URL/?type=recovery or #access_token=...
 */
userRouter.get('/google', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.SITE_URL || 'https://nagpurstreetdog.org'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;

    // Send the OAuth URL back to the frontend
    res.json({ success: true, url: data.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default userRouter;