const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const User = require("./models/User");
const Order = require("./models/Order");
const Pharmacy = require("./models/Pharmacy");
const Notification = require("./models/Notification");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

// Simple JSON file storage helpers
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readJson(fileName, fallback) {
  const filePath = path.join(dataDir, fileName);
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "null") ?? fallback;
  } catch (e) {
    console.error("Failed to read JSON", fileName, e);
    return fallback;
  }
}

function writeJson(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Seed defaults
const defaultUsers = [
  {
    id: "admin-1",
    name: "مدير النظام",
    email: "admin@example.com",
    role: "admin",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  },
  {
    id: "user-1",
    name: "مستخدم تجريبي",
    email: "user@example.com",
    role: "user",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  },
];

if (!fs.existsSync(path.join(dataDir, "users.json")))
  writeJson("users.json", defaultUsers);
if (!fs.existsSync(path.join(dataDir, "orders.json")))
  writeJson("orders.json", []);
if (!fs.existsSync(path.join(dataDir, "pharmacies.json"))) {
  writeJson("pharmacies.json", [
    { id: 1, name: "صيدلية النور" },
    { id: 2, name: "صيدلية الأمل" },
    { id: 3, name: "صيدلية السلام" },
  ]);
}
if (!fs.existsSync(path.join(dataDir, "medicines.json"))) {
  writeJson("medicines.json", {
    1: [{ id: "m1", name: "Paracetamol" }],
    2: [{ id: "m2", name: "Ibuprofen" }],
    3: [{ id: "m3", name: "Aspirin" }],
  });
}

// Auth endpoints using MongoDB + bcrypt + JWT
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, phone, address, city, postalCode, role } =
      req.body || {};
    if (!email || !password || !name || !phone) {
      return res
        .status(400)
        .json({ message: "الرجاء ملء جميع الحقول المطلوبة" });
    }
    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing)
      return res.status(409).json({ message: "البريد مستخدم مسبقاً" });
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await User.create({
      email: String(email).toLowerCase(),
      name,
      passwordHash,
      role: role === "admin" ? "admin" : "user",
      phone: phone || "",
      address: address || "",
      city: city || "",
      postalCode: postalCode || "",
    });
    const token = jwt.sign(
      { sub: created._id, role: created.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    return res.status(201).json({ user: created.toSafeJSON(), token });
  } catch (err) {
    console.error("Register error", err);
    return res.status(500).json({ message: "حدث خطأ أثناء التسجيل" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "البريد وكلمة المرور مطلوبة" });
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    return res.json({ user: user.toSafeJSON(), token });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
  }
});

// Users (profile update)
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const allowed = {
      name: updates.name,
      email: updates.email ? String(updates.email).toLowerCase() : undefined,
      phone: updates.phone,
      address: updates.address,
      city: updates.city,
      postalCode: updates.postalCode,
    };
    Object.keys(allowed).forEach(
      (k) => allowed[k] === undefined && delete allowed[k]
    );
    const updated = await User.findByIdAndUpdate(id, allowed, { new: true });
    if (!updated)
      return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json({ user: updated.toSafeJSON() });
  } catch (err) {
    console.error("Update user error", err);
    return res.status(500).json({ message: "تعذر تحديث المستخدم" });
  }
});

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

// Orders
app.get("/api/orders", authMiddleware, async (req, res) => {
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
});

app.get("/api/orders/:id", authMiddleware, async (req, res) => {
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
});

app.post("/api/orders", authMiddleware, async (req, res) => {
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
});

// Update order status (admin only)
app.patch("/api/orders/:id/status", authMiddleware, async (req, res) => {
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
});

// Pharmacies
app.get("/api/pharmacies", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find()
      .select("name address phone")
      .lean();
    res.json({ pharmacies });
  } catch (err) {
    console.error("Error fetching pharmacies:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب قائمة الصيدليات" });
  }
});

app.get("/api/pharmacies/:id/medicines", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id)
      .select("medicines")
      .lean();

    if (!pharmacy) {
      return res.status(404).json({ message: "لم يتم العثور على الصيدلية" });
    }

    res.json({ medicines: pharmacy.medicines });
  } catch (err) {
    console.error("Get pharmacy medicines error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب قائمة الأدوية" });
  }
});

// Update pharmacy medicines (admin only)
app.put("/api/pharmacies/:id/medicines", adminMiddleware, async (req, res) => {
  try {
    const { medicines } = req.body;

    const pharmacy = await Pharmacy.findOne({
      _id: req.params.id,
      admin: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({ message: "لم يتم العثور على الصيدلية" });
    }

    pharmacy.medicines = medicines;
    await pharmacy.save();

    res.json({ medicines: pharmacy.medicines });
  } catch (err) {
    console.error("Update pharmacy medicines error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث قائمة الأدوية" });
  }
});

// Admin request details (maps to /admin/requests/:id)
app.get("/api/admin/requests/:id", (req, res) => {
  const orders = readJson("orders.json", []);
  const order = orders.find((o) => String(o.id) === String(req.params.id));
  if (!order)
    return res.status(404).json({ message: "لم يتم العثور على الطلب" });
  res.json({ request: order });
});

// Notifications
app.get("/api/notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("order")
      .sort("-createdAt");
    res.json({ notifications });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الإشعارات" });
  }
});

app.patch("/api/notifications/:id/read", authMiddleware, async (req, res) => {
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
});

// Create new pharmacy
app.post("/api/pharmacies", adminMiddleware, async (req, res) => {
  try {
    const { name, address, phone, medicines = [] } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    const pharmacy = await Pharmacy.create({
      name,
      address,
      phone,
      admin: req.user._id,
      medicines,
    });

    res.status(201).json({ pharmacy });
  } catch (err) {
    console.error("Create pharmacy error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الصيدلية" });
  }
});

// Update pharmacy
app.put("/api/pharmacies/:id", adminMiddleware, async (req, res) => {
  try {
    const { name, address, phone, medicines } = req.body;

    // Find pharmacy and verify ownership
    const pharmacy = await Pharmacy.findOne({
      _id: req.params.id,
      admin: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({ message: "لم يتم العثور على الصيدلية" });
    }

    // Update fields
    if (name) pharmacy.name = name;
    if (address) pharmacy.address = address;
    if (phone) pharmacy.phone = phone;
    if (medicines) pharmacy.medicines = medicines;

    await pharmacy.save();
    res.json({ pharmacy });
  } catch (err) {
    console.error("Update pharmacy error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث الصيدلية" });
  }
});

// Delete pharmacy
app.delete("/api/pharmacies/:id", adminMiddleware, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOneAndDelete({
      _id: req.params.id,
      admin: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({ message: "لم يتم العثور على الصيدلية" });
    }

    res.json({ message: "تم حذف الصيدلية بنجاح" });
  } catch (err) {
    console.error("Delete pharmacy error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الصيدلية" });
  }
});

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
