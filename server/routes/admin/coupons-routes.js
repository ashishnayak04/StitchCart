const express = require("express");

const {
  addCoupon,
  getAllCoupons,
  editCoupon,
  toggleCouponActive,
  deleteCoupon,
} = require("../../controllers/admin/coupons-controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addCoupon);
router.get("/get", authMiddleware, adminMiddleware, getAllCoupons);
router.put("/edit/:id", authMiddleware, adminMiddleware, editCoupon);
router.put("/toggle/:id", authMiddleware, adminMiddleware, toggleCouponActive);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteCoupon);

module.exports = router;
