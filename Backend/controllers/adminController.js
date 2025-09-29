const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// Get admin dashboard data
const getAdminDashboard = async (req, res) => {
  try {
    // Find the admin's pharmacy
    const pharmacy = await Pharmacy.findOne({ admin: req.user._id })
      .populate("admin", "name email phone");

    if (!pharmacy) {
      return res.status(404).json({ 
        message: "لم يتم العثور على صيدلية مرتبطة بحسابك",
        hasPharmacy: false
      });
    }

    // Get pharmacy orders
    const orders = await Order.find({ pharmacy: pharmacy._id })
      .populate("user", "name email phone")
      .sort("-createdAt")
      .limit(10); // Latest 10 orders

    // Get order statistics
    const totalOrders = await Order.countDocuments({ pharmacy: pharmacy._id });
    const pendingOrders = await Order.countDocuments({ 
      pharmacy: pharmacy._id, 
      status: "pending" 
    });
    const completedOrders = await Order.countDocuments({ 
      pharmacy: pharmacy._id, 
      status: "completed" 
    });

    // Get unread notifications
    const unreadNotifications = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({
      hasPharmacy: true,
      pharmacy,
      orders,
      statistics: {
        totalOrders,
        pendingOrders,
        completedOrders,
        unreadNotifications
      }
    });
  } catch (err) {
    console.error("Get admin dashboard error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات لوحة التحكم" });
  }
};

// Get admin's pharmacy details
const getMyPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ admin: req.user._id })
      .populate("admin", "name email phone");

    if (!pharmacy) {
      return res.status(404).json({ 
        message: "لم يتم العثور على صيدلية مرتبطة بحسابك",
        hasPharmacy: false
      });
    }

    res.json({ pharmacy, hasPharmacy: true });
  } catch (err) {
    console.error("Get my pharmacy error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات الصيدلية" });
  }
};

// Update admin's pharmacy
const updateMyPharmacy = async (req, res) => {
  try {
    const { name, address, phone, specialties, workingHours, image } = req.body;

    const pharmacy = await Pharmacy.findOne({ admin: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({ 
        message: "لم يتم العثور على صيدلية مرتبطة بحسابك" 
      });
    }

    // Update fields if provided
    if (name) pharmacy.name = name;
    if (address) pharmacy.address = address;
    if (phone) pharmacy.phone = phone;
    if (specialties) pharmacy.specialties = specialties;
    if (workingHours) pharmacy.workingHours = workingHours;
    if (image) pharmacy.image = image;

    await pharmacy.save();

    const updatedPharmacy = await Pharmacy.findById(pharmacy._id)
      .populate("admin", "name email phone");

    res.json({ pharmacy: updatedPharmacy });
  } catch (err) {
    console.error("Update my pharmacy error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات الصيدلية" });
  }
};

// Get admin's pharmacy orders
const getMyPharmacyOrders = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ admin: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({ 
        message: "لم يتم العثور على صيدلية مرتبطة بحسابك" 
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { pharmacy: pharmacy._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: skip + orders.length < totalOrders,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error("Get my pharmacy orders error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب طلبات الصيدلية" });
  }
};

module.exports = {
  getAdminDashboard,
  getMyPharmacy,
  updateMyPharmacy,
  getMyPharmacyOrders,
};
