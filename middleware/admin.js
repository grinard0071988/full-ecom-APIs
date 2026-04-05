const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // First, verify the JWT token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database to check role
    const userModel = require("../models/userModel");
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.userData = decoded;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
