const express = require("express");
const { getOrderTracking } = require("../../controllers/shop/tracking-controller");

const router = express.Router();

router.get("/:id", getOrderTracking);

module.exports = router;
