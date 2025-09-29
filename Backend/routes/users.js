const express = require("express");
const { updateUser } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.put("/:id", authMiddleware, updateUser);

module.exports = router;
