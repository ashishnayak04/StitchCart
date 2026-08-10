const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: String,
    cartId: String,
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: String,
        quantity: Number,
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    subtotalAmount: Number,
    shippingAmount: Number,
    taxAmount: Number,
    discountAmount: Number,
    totalAmount: Number,
    couponCode: String,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: String,
    payerId: String,
    stripePaymentIntentId: String,
    refundStatus: {
      type: String,
      default: "none",
    },
    refundReason: String,
    refundAmount: Number,
    refundedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
