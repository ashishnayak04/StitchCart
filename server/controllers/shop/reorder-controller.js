const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const reorder = async (req, res) => {
  try {
    const { userId, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const addedItems = [];
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (product && product.totalStock >= item.quantity) {
        const existingIndex = cart.items.findIndex(
          (ci) => ci.productId.toString() === item.productId.toString()
        );
        if (existingIndex >= 0) {
          cart.items[existingIndex].quantity += item.quantity;
        } else {
          cart.items.push({ productId: item.productId, quantity: item.quantity });
        }
        addedItems.push(item.title);
      }
    }

    await cart.save();
    res.status(200).json({
      success: true,
      message: `${addedItems.length} items added to cart`,
      data: cart,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { reorder };
