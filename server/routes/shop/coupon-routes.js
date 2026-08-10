const express = require("express");

const { validateCoupon } = require("../../controllers/shop/coupon-controller");

const router = express.Router();

router.post("/validate", validateCoupon);

module.exports = router;
