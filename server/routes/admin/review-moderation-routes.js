const express = require("express");
const {
  getAllReviews,
  deleteReview,
  updateReviewStatus,
} = require("../../controllers/admin/review-moderation-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getAllReviews);
router.put("/status/:id", authMiddleware, adminMiddleware, updateReviewStatus);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteReview);

module.exports = router;
