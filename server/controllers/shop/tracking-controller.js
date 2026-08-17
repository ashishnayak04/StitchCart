const Order = require("../../models/Order");

const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).select("orderStatus statusHistory trackingNumber trackingUrl shippedAt deliveredAt orderDate orderUpdateDate");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { getOrderTracking };
