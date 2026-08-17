const express = require("express");
const { addBrand, getAllBrands, updateBrand, deleteBrand } = require("../../controllers/admin/brand-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addBrand);
router.get("/get", getAllBrands);
router.put("/edit/:id", authMiddleware, adminMiddleware, updateBrand);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteBrand);

module.exports = router;
