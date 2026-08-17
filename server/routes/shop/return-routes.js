const express = require("express");
const { requestReturn } = require("../../controllers/shop/return-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/request/:id", authMiddleware, requestReturn);

module.exports = router;
