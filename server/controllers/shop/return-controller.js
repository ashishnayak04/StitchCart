const Order = require("../../models/Order");
const { restoreStock } = require("./order-controller");

const requestReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus !== "delivered") {
      return res.status(400).json({ success: false, message: "Only delivered orders can be returned" });
    }

    if (order.returnStatus !== "none") {
      return res.status(400).json({ success: false, message: "Return already requested" });
    }

    const daysSinceDelivery = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 30) {
      return res.status(400).json({ success: false, message: "Return window (30 days) has expired" });
    }

    order.returnStatus = "requested";
    order.returnReason = returnReason;
    order.returnRequestedAt = new Date();
    await order.save();

    res.status(200).json({ success: true, message: "Return requested", data: order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { requestReturn };
