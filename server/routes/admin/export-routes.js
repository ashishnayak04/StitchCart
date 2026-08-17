const express = require("express");
const {
  exportOrders,
  exportProducts,
  exportCustomers,
} = require("../../controllers/admin/export-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/orders", authMiddleware, adminMiddleware, exportOrders);
router.get("/products", authMiddleware, adminMiddleware, exportProducts);
router.get("/customers", authMiddleware, adminMiddleware, exportCustomers);

module.exports = router;
