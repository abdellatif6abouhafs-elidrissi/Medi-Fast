const express = require("express");
const {
  getAdminDashboard,
  getMyPharmacy,
  updateMyPharmacy,
  getMyPharmacyOrders,
} = require("../controllers/adminController");
const { adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Admin dashboard routes
router.get("/dashboard", adminMiddleware, getAdminDashboard);
router.get("/pharmacy", adminMiddleware, getMyPharmacy);
router.put("/pharmacy", adminMiddleware, updateMyPharmacy);
router.get("/pharmacy/orders", adminMiddleware, getMyPharmacyOrders);

module.exports = router;
