const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");

// Register user
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      address,
      city,
      postalCode,
      role,
      // Additional pharmacy fields for admin registration
      pharmacyName,
      pharmacySpecialties,
      pharmacyWorkingHours,
      pharmacyImage,
    } = req.body || {};

    if (!email || !password || !name || !phone) {
      return res
        .status(400)
        .json({ message: "الرجاء ملء جميع الحقول المطلوبة" });
    }

    // Additional validation for admin registration
    if (role === "admin" && (!pharmacyName || !address || !phone)) {
      return res
        .status(400)
        .json({
          message:
            "يجب تقديم معلومات الصيدلية كاملة (الاسم، العنوان، رقم الهاتف) للتسجيل كمدير",
        });
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

    // If registering as admin, create associated pharmacy
    if (role === "admin") {
      try {
        const pharmacy = await Pharmacy.create({
          name: pharmacyName,
          address,
          phone,
          admin: created._id,
          specialties: pharmacySpecialties || [],
          workingHours: pharmacyWorkingHours || "8:00 ص - 9:00 م",
          image: pharmacyImage || "🏪",
        });

        // Update the user with their pharmacy reference
        await User.findByIdAndUpdate(created._id, { pharmacy: pharmacy._id });
      } catch (error) {
        // If pharmacy creation fails, delete the created user
        await User.findByIdAndDelete(created._id);
        throw error;
      }
    }

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
};

// Login user
const login = async (req, res) => {
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
};

module.exports = { register, login };
