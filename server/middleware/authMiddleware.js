const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "hirebridge_jwt_secret_key_123456";

// Protect route - verifies token and role
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user details to request
      req.user = decoded; // Contains id and role
      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

// Only company role allowed
const companyOnly = (req, res, next) => {
  if (req.user && req.user.role === "company") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Company role required." });
  }
};

// Only student role allowed
const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Student role required." });
  }
};

module.exports = {
  protect,
  companyOnly,
  studentOnly,
};
