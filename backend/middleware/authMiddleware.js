const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 * Expected format: Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided."
    });
  }

  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Invalid token format. Use: Bearer <token>"
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
    });
  }
}

module.exports = authMiddleware;