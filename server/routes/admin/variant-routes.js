const express = require("express");
const {
  addVariant,
  updateVariant,
  deleteVariant,
  getVariantsByProduct,
} = require("../../controllers/admin/admin-variant-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addVariant);
router.put("/edit/:id", authMiddleware, adminMiddleware, updateVariant);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteVariant);
router.get("/get/:productId", authMiddleware, adminMiddleware, getVariantsByProduct);

module.exports = router;
