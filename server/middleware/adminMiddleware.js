// Middleware to ensure that the request belongs to an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin role required." });
  }
};

module.exports = {
  adminOnly,
};
