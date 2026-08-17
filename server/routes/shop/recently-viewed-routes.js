const express = require("express");
const {
  addRecentlyViewed,
  getRecentlyViewed,
} = require("../../controllers/shop/recently-viewed-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authMiddleware, addRecentlyViewed);
router.get("/get/:userId", authMiddleware, getRecentlyViewed);

module.exports = router;
