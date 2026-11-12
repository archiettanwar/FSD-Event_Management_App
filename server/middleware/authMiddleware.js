const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token
async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_2026");

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User belonging to this token no longer exists" });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. No authentication token provided." });
  }
}

// Middleware to restrict access based on user role (RBAC)
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user ? req.user.role : "unknown"}' is not authorized to access this route. Admin role required.`,
      });
    }
    next();
  };
}

// Middleware to restrict access strictly to Admin users
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: `Access denied. Role '${req.user ? req.user.role : "unknown"}' is not authorized to access this route. Admin role required.`,
    });
  }
  next();
}

module.exports = { protect, authorize, adminOnly };

