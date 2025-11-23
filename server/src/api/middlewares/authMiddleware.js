import { supabaseAdmin } from "../../config/supabase.js";

/**
 * Middleware to verify Supabase JWT token and attach user info to req.user
 */
export const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new Error('No token provided');

    const token = authHeader.split(' ')[1]; // "Bearer <access_token>"
    if (!token) throw new Error('Invalid token format');

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) throw new Error('Invalid token');

    req.user = {
      id: user.id,
      email: user.email,
      type: user.user_metadata.type, 
      first_name: user.user_metadata.first_name,
      last_name: user.user_metadata.last_name,
    };

    next(); 
  } catch (err) {
    return res.status(401).json({
      status: "error",
      data: {},
      message: err.message
    });
  }
};

/**
 * Middleware to ensure the user is a Super Admin
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== 'SUPER_ADMIN') {
    return res.status(403).json({
      status: "error",
      data: {},
      message: "Forbidden: Only super admins can perform this action"
    });
  }
  next();
};




export const validateResetToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      status: "error",
      data: {},
      message: "A valid reset token is required.",
    });
  }

  // Extract token from header
  req.token = authHeader.split(" ")[1];
  next();
};
