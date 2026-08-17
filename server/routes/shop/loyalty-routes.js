const express = require("express");
const {
  getLoyaltyPoints,
  redeemPoints,
} = require("../../controllers/shop/loyalty-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get/:userId", authMiddleware, getLoyaltyPoints);
router.post("/redeem", authMiddleware, redeemPoints);

module.exports = router;
