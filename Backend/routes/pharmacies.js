const express = require("express");
const {
  getAllPharmacies,
  getPharmacyMedicines,
  updatePharmacyMedicines,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
} = require("../controllers/pharmacyController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllPharmacies);
router.get("/:id/medicines", getPharmacyMedicines);
router.put("/:id/medicines", adminMiddleware, updatePharmacyMedicines);
router.post("/", adminMiddleware, createPharmacy);
router.put("/:id", adminMiddleware, updatePharmacy);
router.delete("/:id", adminMiddleware, deletePharmacy);

module.exports = router;
