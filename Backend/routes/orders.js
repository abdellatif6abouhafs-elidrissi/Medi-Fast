const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrder);
router.post("/", authMiddleware, createOrder);
router.patch("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;
