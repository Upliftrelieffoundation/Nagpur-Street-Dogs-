import supabase from '../Utils/supabase.js';

/**
 * Middleware: Verifies that the request has a valid Supabase JWT token.
 * The token is issued by Supabase Auth when a user logs in (email/password or Google OAuth).
 * The frontend sends it as: Authorization: Bearer <token>
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Ask Supabase to verify the token and return the user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach the Supabase user to the request object
    // req.user.id = the user's UUID in Supabase auth.users table
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token verification failed' });
  }
};