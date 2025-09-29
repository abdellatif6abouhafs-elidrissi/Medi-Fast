const User = require("../models/User");

// Update user profile
const updateUser = async (req, res) => {
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
};

module.exports = { updateUser };
