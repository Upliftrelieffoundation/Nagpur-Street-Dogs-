import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './Routes/UserRouter.js';
import blogRouter from './Routes/BlogRouter.js';
import dogRouter from './Routes/DogRouter.js';
import volunteerRouter from './Routes/VolunteerRouter.js';
import Donationrouter from './Routes/DonationRouter.js';
import vetClinicRouter from './Routes/VetClinicRouter.js';
import lostDogRouter from './Routes/LostDogRouter.js';
import overpassRouter from './Routes/OverpassRouter.js';
import { verifyToken } from './Middleware/auth.js';
import supabase from './Utils/supabase.js';

dotenv.config();

const app = express();

// -------------------------------------------------------
// CORS — allow requests from the frontend (Vercel + local)
// -------------------------------------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'https://nsd-website-oef9.vercel.app',
  'https://nsd-frontend.vercel.app',
  'https://www.nagpurstreetdog.org',
  'https://nagpurstreetdog.org',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// -------------------------------------------------------
// ROUTES
// -------------------------------------------------------
app.use('/api/user', userRouter);
app.use('/blog', blogRouter);
app.use('/api/dog', dogRouter);
app.use('/api/volunteer', volunteerRouter);
app.use('/api/donation', Donationrouter);
app.use('/api/vet-clinics', vetClinicRouter);
app.use('/api/lost-dogs', lostDogRouter);
app.use('/api/overpass', overpassRouter);

// Health check — useful to confirm the serverless function is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// -------------------------------------------------------
// GET USER PROFILE — /api/user/profile/:userId
// (Also accessible via the user router, kept here for backwards compat)
// -------------------------------------------------------
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, name, email, occupation, image, phone, address_city, address_state, created_at')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { data: blogs } = await supabase
      .from('blogs')
      .select('blog_id, title, banner, published_at, total_likes, total_reads')
      .eq('author_id', userId)
      .eq('draft', false)
      .order('published_at', { ascending: false });

    const { data: dogs } = await supabase
      .from('dogs')
      .select('id, name, breed, images, is_adopted')
      .eq('owner_id', userId)
      .eq('is_adopted', false);

    res.json({ ...profile, blogs: blogs || [], dogsForAdoption: dogs || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------------------------------------------
// DELETE A DOG — requires auth
// -------------------------------------------------------
app.delete('/api/dog/delete/:dogId', verifyToken, async (req, res) => {
  try {
    const { dogId } = req.params;

    const { data: dog } = await supabase.from('dogs').select('owner_id').eq('id', dogId).single();

    if (!dog) return res.status(404).json({ message: 'Dog not found' });
    if (dog.owner_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await supabase.from('dogs').delete().eq('id', dogId);
    res.json({ message: 'Dog removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------------------------------------------
// DELETE A BLOG — requires auth
// -------------------------------------------------------
app.delete('/api/blog/delete/:blogId', verifyToken, async (req, res) => {
  try {
    const { blogId } = req.params;

    const { data: blog } = await supabase.from('blogs').select('author_id').eq('id', blogId).single();

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await supabase.from('blogs').delete().eq('id', blogId);
    res.json({ message: 'Blog removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------------------------------------------
// EXPORT for Vercel Serverless Function
// (Vercel calls this as a handler, not app.listen)
// -------------------------------------------------------
export default app;

// -------------------------------------------------------
// START SERVER — only when running locally (not on Vercel)
// -------------------------------------------------------
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}