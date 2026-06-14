import express from 'express';
import supabase from '../Utils/supabase.js';

const router = express.Router();

// Same Haversine formula for nearby clinic search
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET all verified vet clinics
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vet_clinics')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET clinics near a location
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const distance = maxDistance ? parseInt(maxDistance) : 10000;

    const { data, error } = await supabase
      .from('vet_clinics')
      .select('*')
      .eq('is_verified', true);

    if (error) throw error;

    const nearby = data.filter((clinic) =>
      haversineDistance(parseFloat(lat), parseFloat(lng), clinic.lat, clinic.lng) <= distance
    );

    res.json(nearby);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single clinic
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vet_clinics')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ message: 'Clinic not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST — add a vet clinic
router.post('/', async (req, res) => {
  try {
    const { name, address, phone, hours, lat, lng, userId } = req.body;

    if (!name || !address || !phone || !hours || !lat || !lng) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('vet_clinics')
      .insert({
        name,
        address,
        phone,
        hours,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        added_by: userId || null,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT — update a clinic
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vet_clinics')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Clinic not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE — remove a clinic
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('vet_clinics').delete().eq('id', req.params.id);
    if (error) return res.status(404).json({ message: 'Clinic not found' });
    res.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
