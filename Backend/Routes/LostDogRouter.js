import express from 'express';
import supabase from '../Utils/supabase.js';

const router = express.Router();

// Simple Haversine distance formula (replaces MongoDB $near geospatial query)
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET all lost dogs (status = 'lost')
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lost_dogs')
      .select('*')
      .eq('status', 'lost')
      .order('date_lost', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET lost dogs near a location (Haversine distance filter)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const distance = maxDistance ? parseInt(maxDistance) : 10000;

    // Fetch all lost dogs then filter by distance in JavaScript
    const { data, error } = await supabase
      .from('lost_dogs')
      .select('*')
      .eq('status', 'lost');

    if (error) throw error;

    const nearby = data.filter((dog) =>
      haversineDistance(parseFloat(lat), parseFloat(lng), dog.lat, dog.lng) <= distance
    );

    res.json(nearby);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single lost dog
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lost_dogs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ message: 'Lost dog report not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST — report a lost dog
router.post('/', async (req, res) => {
  try {
    const { name, description, breed, color, contact, dateLost, lat, lng, image, userId } = req.body;

    if (!name || !description || !contact || !dateLost || !lat || !lng) {
      return res.status(400).json({ message: 'Required fields: name, description, contact, dateLost, lat, lng' });
    }

    const { data, error } = await supabase
      .from('lost_dogs')
      .insert({
        name,
        description,
        breed: breed || null,
        color: color || null,
        contact,
        date_lost: dateLost,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        image: image || null,
        reported_by: userId || null,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT — update a lost dog report
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lost_dogs')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Lost dog report not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH — mark dog as found
router.patch('/:id/found', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lost_dogs')
      .update({ status: 'found', is_found: true, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Lost dog report not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE — remove a report
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('lost_dogs').delete().eq('id', req.params.id);
    if (error) return res.status(404).json({ message: 'Lost dog report not found' });
    res.json({ message: 'Lost dog report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
