const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

const exportOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });
    const csv = [
      "Order ID,Date,User,Customer Email,Status,Payment,Total,Items",
      ...orders.map((o) => `${o._id},${o.orderDate},${o.userId},${o.addressInfo?.phone || ""},${o.orderStatus},${o.paymentMethod},${o.totalAmount},"${(o.cartItems || []).map((i) => i.title + " x" + i.quantity).join("; ")}"`),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.status(200).send(csv);
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const exportProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    const csv = [
      "ID,Title,Category,Brand,Price,Sale Price,Stock,Avg Review",
      ...products.map((p) => `${p._id},"${p.title}",${p.category},${p.brand},${p.price},${p.salePrice || ""},${p.totalStock},${p.averageReview || ""}`),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.status(200).send(csv);
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const exportCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    const csv = [
      "ID,Username,Email,Phone,Email Verified,Created At",
      ...users.map((u) => `${u._id},${u.userName},${u.email},${u.phone || ""},${u.isEmailVerified},${u.createdAt}`),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=customers.csv");
    res.status(200).send(csv);
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { exportOrders, exportProducts, exportCustomers };
