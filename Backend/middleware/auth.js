const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "غير مصرح" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: "غير مصرح" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "غير مصرح" });
  }
};

// Admin middleware
const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "غير مصرح" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await User.findById(decoded.sub);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "غير مصرح للمستخدم العادي" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "غير مصرح" });
  }
};

module.exports = { authMiddleware, adminMiddleware };
