const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
} = require("../../controllers/shop/wishlist-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authMiddleware, addToWishlist);
router.delete("/:userId/:productId", authMiddleware, removeFromWishlist);
router.get("/get/:userId", authMiddleware, getWishlist);
router.get("/check/:userId/:productId", authMiddleware, checkWishlist);

module.exports = router;
