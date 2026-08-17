const paypal = require("../../helpers/paypal");
const { getStripeClient } = require("../../helpers/stripe");
const Order = require("../../models/Order");
const { logAction } = require("./audit-log-controller");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({}).sort({ orderDate: -1 }).skip(skip).limit(limit),
      Order.countDocuments({}),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getRefundedOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const filter = { refundStatus: { $ne: "none" } };
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ orderDate: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const refundOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    if (order.refundStatus === "processed") {
      return res.status(400).json({
        success: false,
        message: "Order has already been refunded",
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order has not been paid, no refund needed",
      });
    }

    let refundProcessed = false;

    try {
      if (order.paymentMethod === "stripe" && order.stripePaymentIntentId) {
        await getStripeClient().refunds.create({
          payment_intent: order.stripePaymentIntentId,
        });
        refundProcessed = true;
      } else if (order.paymentMethod === "paypal" && order.paymentId) {
        const payment = await new Promise((resolve, reject) => {
          paypal.payment.get(order.paymentId, (err, info) => {
            if (err) return reject(err);
            resolve(info);
          });
        });
        const sale = payment?.transactions?.[0]?.related_resources?.[0]?.sale;
        if (sale) {
          await new Promise((resolve, reject) => {
            paypal.sale.refund(sale.id, {}, (err, info) => {
              if (err) return reject(err);
              resolve(info);
            });
          });
          refundProcessed = true;
        }
      }
    } catch (refundError) {
      console.log("Refund failed:", refundError);
    }

    order.refundStatus = refundProcessed ? "processed" : "requested";
    order.refundReason = refundReason || order.refundReason || "Admin refund";
    order.refundAmount = order.totalAmount;
    if (refundProcessed) order.refundedAt = new Date();
    order.orderStatus = refundProcessed ? "cancelled" : order.orderStatus;
    order.orderUpdateDate = new Date();

    await order.save();
    logAction(req.user?.id, "REFUND_ORDER", "Order", order._id.toString(), { refundStatus: order.refundStatus, refundReason }, req.ip);

    res.status(200).json({
      success: true,
      message: refundProcessed
        ? "Refund processed successfully"
        : "Refund request recorded",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, trackingUrl, note } = req.body;

    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    order.orderStatus = orderStatus;
    order.orderUpdateDate = new Date();

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({ status: orderStatus, date: new Date(), note: note || "" });

    if (orderStatus === "shipped") {
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (trackingUrl) order.trackingUrl = trackingUrl;
      order.shippedAt = new Date();
    }
    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();
    logAction(req.user?.id, "UPDATE_ORDER_STATUS", "Order", order._id.toString(), { orderStatus, trackingNumber }, req.ip);

    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  refundOrder,
  getRefundedOrders,
};
