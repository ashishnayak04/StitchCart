const express = require("express");
const { getVariants } = require("../../controllers/shop/variant-controller");

const router = express.Router();

router.get("/get/:productId", getVariants);

module.exports = router;
