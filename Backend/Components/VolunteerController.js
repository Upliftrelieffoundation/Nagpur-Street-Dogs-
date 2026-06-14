import supabase from '../Utils/supabase.js';

/**
 * CREATE VOLUNTEER — store a new volunteer application
 * OLD: new VolunteerSchema(req.body).save()
 * NEW: supabase.from('volunteers').insert()
 */
export async function createVolunteer(req, res) {
  try {
    const { name, email, phone, address, city, state, country, pincode } = req.body;

    const { data, error } = await supabase
      .from('volunteers')
      .insert({ name, email, phone, address, city, state, country, pincode })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}