const express = require("express");
const {
  getAllMedicines,
  getMedicinesByPharmacy,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStock,
  getCategories,
} = require("../controllers/medicineController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllMedicines);
router.get("/pharmacy", getMedicinesByPharmacy);
router.get("/categories", getCategories);
router.get("/:id", getMedicineById);

// Admin routes
router.post("/", adminMiddleware, createMedicine);
router.put("/:id", adminMiddleware, updateMedicine);
router.delete("/:id", adminMiddleware, deleteMedicine);
router.patch("/:id/stock", adminMiddleware, updateMedicineStock);

module.exports = router;
