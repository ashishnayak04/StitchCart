const express = require("express");
const { getFAQs } = require("../../controllers/shop/faq-controller");

const router = express.Router();

router.get("/", getFAQs);

module.exports = router;
