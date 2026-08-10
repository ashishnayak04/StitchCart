const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  refundOrder,
  getRefundedOrders,
} = require("../../controllers/admin/order-controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getAllOrdersOfAllUsers);
router.get(
  "/details/:id",
  authMiddleware,
  adminMiddleware,
  getOrderDetailsForAdmin
);
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);
router.get("/refunds", authMiddleware, adminMiddleware, getRefundedOrders);
router.post("/refund/:id", authMiddleware, adminMiddleware, refundOrder);

module.exports = router;
