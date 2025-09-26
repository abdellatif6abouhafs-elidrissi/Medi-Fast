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

// Orders
app.get("/api/orders", (req, res) => {
  const orders = readJson("orders.json", []);
  res.json({ orders });
});

app.get("/api/orders/:id", (req, res) => {
  const orders = readJson("orders.json", []);
  const order = orders.find((o) => String(o.id) === String(req.params.id));
  if (!order)
    return res.status(404).json({ message: "لم يتم العثور على الطلب" });
  res.json({ order });
});

app.post("/api/orders", (req, res) => {
  const { name, phone, address, medicineName, notes } = req.body || {};
  if (!name || !phone || !address || !medicineName) {
    return res.status(400).json({ message: "بيانات الطلب غير كاملة" });
  }
  const orders = readJson("orders.json", []);
  const newOrder = {
    id: orders.length ? orders[orders.length - 1].id + 1 : 1,
    name,
    phone,
    address,
    medicineName,
    notes: notes || "",
    status: "قيد المراجعة",
    date: new Date().toISOString(),
  };
  orders.push(newOrder);
  writeJson("orders.json", orders);
  res.status(201).json({ order: newOrder });
});

// Pharmacies
app.get("/api/pharmacies", (req, res) => {
  const pharmacies = readJson("pharmacies.json", []);
  res.json({ pharmacies });
});

app.get("/api/pharmacies/:id/medicines", (req, res) => {
  const medicinesMap = readJson("medicines.json", {});
  const list = medicinesMap[String(req.params.id)] || [];
  res.json({ medicines: list });
});

// Admin request details (maps to /admin/requests/:id)
app.get("/api/admin/requests/:id", (req, res) => {
  const orders = readJson("orders.json", []);
  const order = orders.find((o) => String(o.id) === String(req.params.id));
  if (!order)
    return res.status(404).json({ message: "لم يتم العثور على الطلب" });
  res.json({ request: order });
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
