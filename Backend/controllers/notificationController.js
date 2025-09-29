const Notification = require("../models/Notification");

// Get notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("order")
      .sort("-createdAt");
    res.json({ notifications });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الإشعارات" });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "لم يتم العثور على الإشعار" });
    }

    res.json({ notification });
  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث الإشعار" });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
};
