const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  // Extract token from Authorization header (format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(403).send('Access denied - No authorization header');
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  if (!token) {
    return res.status(403).send('Access denied - No token provided');
  }

  try {
    // For Cognito tokens (JWT), decode without verification for development
    // In production, you should verify against Cognito's public keys
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return res.status(403).send('Invalid token - Cannot decode');
    }

    // Check if token is expired
    if (decoded.payload.exp && decoded.payload.exp < Date.now() / 1000) {
      return res.status(403).send('Token expired');
    }

    // For development: accept decoded token
    // For production: verify with Cognito public key
    req.user = decoded.payload;
    next();
  } catch (err) {
    // If JWT_SECRET is set, try traditional JWT verification
    if (process.env.JWT_SECRET) {
      jwt.verify(token, process.env.JWT_SECRET, (verifyErr, user) => {
        if (verifyErr) {
          return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(403).send('Invalid token - ' + err.message);
    }
  }
};
