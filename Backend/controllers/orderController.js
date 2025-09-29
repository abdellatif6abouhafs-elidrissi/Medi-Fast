const Order = require("../models/Order");
const Pharmacy = require("../models/Pharmacy");
const Notification = require("../models/Notification");

// Get orders
const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") {
      // Admin sees all orders for their pharmacy
      const pharmacy = await Pharmacy.findOne({ admin: req.user._id });
      if (pharmacy) {
        orders = await Order.find({ pharmacy: pharmacy._id })
          .populate("user", "name email phone")
          .sort("-createdAt");
      } else {
        orders = [];
      }
    } else {
      // Regular users see their own orders
      orders = await Order.find({ user: req.user._id })
        .populate("pharmacy", "name address phone")
        .sort("-createdAt");
    }
    res.json({ orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الطلبات" });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("pharmacy", "name address phone");

    if (!order) {
      return res.status(404).json({ message: "لم يتم العثور على الطلب" });
    }

    // Check if user has permission to view this order
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "غير مصرح لك بعرض هذا الطلب" });
    }

    res.json({ order });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الطلب" });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      pharmacyId,
      medicineName,
      quantity = 1,
      address,
      phone,
      notes,
    } = req.body || {};

    if (!pharmacyId || !medicineName || !address || !phone) {
      return res.status(400).json({ message: "بيانات الطلب غير كاملة" });
    }

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: "لم يتم العثور على الصيدلية" });
    }

    const order = await Order.create({
      user: req.user._id,
      pharmacy: pharmacy._id,
      medicine: {
        name: medicineName,
        quantity,
      },
      address,
      phone,
      notes: notes || "",
      status: "pending",
    });

    // Create notification for pharmacy admin
    await Notification.create({
      recipient: pharmacy.admin,
      type: "new_order",
      order: order._id,
      title: "طلب جديد",
      message: `طلب جديد من ${req.user.name} للحصول على ${medicineName}`,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("pharmacy", "name address phone");

    res.status(201).json({ order: populatedOrder });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الطلب" });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "حالة الطلب غير صالحة" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "لم يتم العثور على الطلب" });
    }

    // Verify admin owns this pharmacy
    const pharmacy = await Pharmacy.findOne({
      _id: order.pharmacy,
      admin: req.user._id,
    });
    if (!pharmacy) {
      return res.status(403).json({ message: "غير مصرح لك بتحديث هذا الطلب" });
    }

    order.status = status;
    await order.save();

    // Create notification for user
    await Notification.create({
      recipient: order.user,
      type: "order_status_change",
      order: order._id,
      title: "تحديث حالة الطلب",
      message: `تم تحديث حالة طلبك إلى: ${status}`,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("pharmacy", "name address phone");

    res.json({ order: populatedOrder });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث حالة الطلب" });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
};
