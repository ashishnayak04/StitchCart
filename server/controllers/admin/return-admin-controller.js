const Order = require("../../models/Order");
const Product = require("../../models/Product");
const { logAction } = require("./audit-log-controller");

const getReturnRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { returnStatus: status } : { returnStatus: { $ne: "none" } };
    const orders = await Order.find(filter).sort({ returnRequestedAt: -1 }).populate("userId", "userName email");
    res.status(200).json({ success: true, data: orders });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const processReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (action === "approve") {
      order.returnStatus = "approved";
      order.returnResolvedAt = new Date();
      // Restore stock
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (product) { product.totalStock += item.quantity; await product.save(); }
      }
      order.statusHistory.push({ status: "return-approved", date: new Date(), note: "Return approved, stock restored" });
    } else if (action === "reject") {
      order.returnStatus = "none";
      order.returnReason = "";
      order.statusHistory.push({ status: "return-rejected", date: new Date(), note: "Return request rejected" });
    }

    await order.save();
    logAction(req.user?.id, action === "approve" ? "APPROVE_RETURN" : "REJECT_RETURN", "Order", order._id.toString(), { returnStatus: order.returnStatus }, req.ip);
    res.status(200).json({ success: true, data: order });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

module.exports = { getReturnRequests, processReturn };
