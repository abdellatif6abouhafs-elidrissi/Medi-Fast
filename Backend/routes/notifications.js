const express = require("express");
const {
  getNotifications,
  markNotificationRead,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:id/read", authMiddleware, markNotificationRead);

module.exports = router;
