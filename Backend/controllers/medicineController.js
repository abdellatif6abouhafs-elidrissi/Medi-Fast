const Pharmacy = require("../models/Pharmacy");

// Get all medicines (from all pharmacies or filtered)
const getAllMedicines = async (req, res) => {
  try {
    const { pharmacyId, category, search, inStock } = req.query;
    
    let query = {};
    
    // Filter by pharmacy if specified
    if (pharmacyId) {
      query._id = pharmacyId;
    }
    
    const pharmacies = await Pharmacy.find(query).select('medicines name');
    
    // Flatten medicines from all pharmacies
    let allMedicines = [];
    pharmacies.forEach(pharmacy => {
      if (pharmacy.medicines && pharmacy.medicines.length > 0) {
        const medicinesWithPharmacy = pharmacy.medicines.map(med => ({
          ...med.toObject(),
          _id: med._id,
          pharmacyId: pharmacy._id,
          pharmacyName: pharmacy.name,
        }));
        allMedicines = allMedicines.concat(medicinesWithPharmacy);
      }
    });
    
    // Apply filters
    if (category) {
      allMedicines = allMedicines.filter(med => med.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      allMedicines = allMedicines.filter(med => 
        med.name.toLowerCase().includes(searchLower) ||
        med.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (inStock !== undefined) {
      const stockFilter = inStock === 'true';
      allMedicines = allMedicines.filter(med => med.inStock === stockFilter);
    }
    
    res.json({
      medicines: allMedicines,
      total: allMedicines.length,
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Error fetching medicines" });
  }
};

// Get medicines by pharmacy
const getMedicinesByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.query;
    
    if (!pharmacyId) {
      return res.status(400).json({ message: "Pharmacy ID is required" });
    }
    
    const pharmacy = await Pharmacy.findById(pharmacyId).select('medicines name');
    
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    
    const medicinesWithPharmacy = pharmacy.medicines.map(med => ({
      ...med.toObject(),
      pharmacyId: pharmacy._id,
      pharmacyName: pharmacy.name,
    }));
    
    res.json({
      medicines: medicinesWithPharmacy,
      total: medicinesWithPharmacy.length,
    });
  } catch (error) {
    console.error("Error fetching pharmacy medicines:", error);
    res.status(500).json({ message: "Error fetching pharmacy medicines" });
  }
};

// Get single medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find pharmacy that contains this medicine
    const pharmacy = await Pharmacy.findOne({ "medicines._id": id })
      .select('medicines name');
    
    if (!pharmacy) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    
    const medicine = pharmacy.medicines.id(id);
    
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    
    res.json({
      ...medicine.toObject(),
      pharmacyId: pharmacy._id,
      pharmacyName: pharmacy.name,
    });
  } catch (error) {
    console.error("Error fetching medicine:", error);
    res.status(500).json({ message: "Error fetching medicine" });
  }
};

// Create medicine (admin only)
const createMedicine = async (req, res) => {
  try {
    const { pharmacyId, ...medicineData } = req.body;
    
    if (!pharmacyId) {
      return res.status(400).json({ message: "Pharmacy ID is required" });
    }
    
    const pharmacy = await Pharmacy.findById(pharmacyId);
    
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    
    // Check if user is admin of this pharmacy
    if (req.user.role !== 'admin' || req.user._id.toString() !== pharmacy.admin.toString()) {
      return res.status(403).json({ message: "Not authorized to add medicines to this pharmacy" });
    }
    
    pharmacy.medicines.push(medicineData);
    await pharmacy.save();
    
    const newMedicine = pharmacy.medicines[pharmacy.medicines.length - 1];
    
    res.status(201).json({
      ...newMedicine.toObject(),
      pharmacyId: pharmacy._id,
      pharmacyName: pharmacy.name,
    });
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({ message: "Error creating medicine" });
  }
};

// Update medicine (admin only)
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const pharmacy = await Pharmacy.findOne({ "medicines._id": id });
    
    if (!pharmacy) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    
    // Check if user is admin of this pharmacy
    if (req.user.role !== 'admin' || req.user._id.toString() !== pharmacy.admin.toString()) {
      return res.status(403).json({ message: "Not authorized to update this medicine" });
    }
    
    const medicine = pharmacy.medicines.id(id);
    
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    
    // Update medicine fields
    Object.keys(updateData).forEach(key => {
      medicine[key] = updateData[key];
    });
    
    await pharmacy.save();
    
    res.json({
      ...medicine.toObject(),
      pharmacyId: pharmacy._id,
      pharmacyName: pharmacy.name,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ message: "Error updating medicine" });
  }
};

// Delete medicine (admin only)
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pharmacy = await Pharmacy.findOne({ "medicines._id": id });
    
    if (!pharmacy) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    
    // Check if user is admin of this pharmacy
    if (req.user.role !== 'admin' || req.user._id.toString() !== pharmacy.admin.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this medicine" });
    }
    
    pharmacy.medicines.pull(id);
    await pharmacy.save();
    
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ message: "Error deleting medicine" });
  }
};

// Update medicine stock
const updateMedicineStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: "Stock value is required" });
    }
    
    const pharmacy = await Pharmacy.findOne({ "medicines._id": id });
    
    if (!pharmacy) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    
    // Check if user is admin of this pharmacy
    if (req.user.role !== 'admin' || req.user._id.toString() !== pharmacy.admin.toString()) {
      return res.status(403).json({ message: "Not authorized to update this medicine" });
    }
    
    const medicine = pharmacy.medicines.id(id);
    
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    
    medicine.stock = stock;
    medicine.inStock = stock > 0;
    
    await pharmacy.save();
    
    res.json({
      ...medicine.toObject(),
      pharmacyId: pharmacy._id,
      pharmacyName: pharmacy.name,
    });
  } catch (error) {
    console.error("Error updating medicine stock:", error);
    res.status(500).json({ message: "Error updating medicine stock" });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({}).select('medicines.category');
    
    const categoriesSet = new Set();
    pharmacies.forEach(pharmacy => {
      if (pharmacy.medicines) {
        pharmacy.medicines.forEach(med => {
          if (med.category) {
            categoriesSet.add(med.category);
          }
        });
      }
    });
    
    res.json(Array.from(categoriesSet));
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

module.exports = {
  getAllMedicines,
  getMedicinesByPharmacy,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStock,
  getCategories,
};
