const express = require("express");

const {
  createOrder,
  capturePayment,
  createStripeOrder,
  captureStripePayment,
  cancelOrder,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/create-stripe", createStripeOrder);
router.post("/capture", capturePayment);
router.get("/stripe-return/:orderId/:sessionId", captureStripePayment);
router.post("/cancel/:id", cancelOrder);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
