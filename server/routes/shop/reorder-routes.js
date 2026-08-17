const express = require("express");
const { reorder } = require("../../controllers/shop/reorder-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/", authMiddleware, reorder);

module.exports = router;
