import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      user_id: decoded.user_id, // changed from id to user_id
      roles: decoded.roles,
      contact_id: decoded.contact_id // may be undefined for non-clients
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}; 