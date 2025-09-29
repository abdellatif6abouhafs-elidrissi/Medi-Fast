  const Pharmacy = require("../models/Pharmacy");
  const User = require("../models/User");

  // Get all pharmacies
  const getAllPharmacies = async (req, res) => {
    try {
      const pharmacies = await Pharmacy.find({}).populate(
        "admin",
        "name email phone" // بدون -passwordHash
      );
      res.json({ pharmacies });
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      res.status(500).json({ message: "Error fetching pharmacies" });
    }
  };

  // Get pharmacy medicines
  const getPharmacyMedicines = async (req, res) => {
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
  };

  // Update pharmacy medicines (admin only)
  const updatePharmacyMedicines = async (req, res) => {
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
  };

  // Create new pharmacy
  const createPharmacy = async (req, res) => {
    try {
      // Check if admin already has a pharmacy
      const existingPharmacy = await Pharmacy.findOne({ admin: req.user._id });
      if (existingPharmacy) {
        return res.status(409).json({ 
          message: "لديك صيدلية مسجلة بالفعل. لا يمكن إنشاء أكثر من صيدلية واحدة لكل حساب مدير" 
        });
      }

      const { name, address, phone, medicines = [], specialties = [], workingHours, image } = req.body;

      if (!name || !address || !phone) {
        return res.status(400).json({ message: "جميع الحقول مطلوبة" });
      }

      const pharmacy = await Pharmacy.create({
        name,
        address,
        phone,
        admin: req.user._id,
        medicines,
        specialties,
        workingHours: workingHours || "8:00 ص - 9:00 م",
        image: image || "🏪",
      });

      // Update user with pharmacy reference
      await User.findByIdAndUpdate(req.user._id, { pharmacy: pharmacy._id });

      res.status(201).json({ pharmacy });
    } catch (err) {
      console.error("Create pharmacy error:", err);
      res.status(500).json({ message: "حدث خطأ أثناء إنشاء الصيدلية" });
    }
  };

  // Update pharmacy
  const updatePharmacy = async (req, res) => {
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
  };

  // Delete pharmacy
  const deletePharmacy = async (req, res) => {
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
  };

  module.exports = {
    getAllPharmacies,
    getPharmacyMedicines,
    updatePharmacyMedicines,
    createPharmacy,
    updatePharmacy,
    deletePharmacy,
  };
