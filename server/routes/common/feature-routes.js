const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.get("/get", getFeatureImages);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteFeatureImage
);

module.exports = router;
