const express = require("express");
const {
  getDashboardStats,
  getRevenueChart,
  getRevenueByCategory,
  getRevenueByBrand,
  getCouponPerformance,
  getTopProducts,
  getAllCustomers,
  getCustomerDetails,
  blockUser,
} = require("../../controllers/admin/admin-analytics-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);
router.get("/revenue", authMiddleware, adminMiddleware, getRevenueChart);
router.get("/revenue-by-category", authMiddleware, adminMiddleware, getRevenueByCategory);
router.get("/revenue-by-brand", authMiddleware, adminMiddleware, getRevenueByBrand);
router.get("/coupon-performance", authMiddleware, adminMiddleware, getCouponPerformance);
router.get("/top-products", authMiddleware, adminMiddleware, getTopProducts);
router.get("/customers", authMiddleware, adminMiddleware, getAllCustomers);
router.get("/customers/:id", authMiddleware, adminMiddleware, getCustomerDetails);
router.put("/customers/:id/block", authMiddleware, adminMiddleware, blockUser);

module.exports = router;
