const paypal = require("../../helpers/paypal");
const { getStripeClient } = require("../../helpers/stripe");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Coupon = require("../../models/Coupon");
const User = require("../../models/User");
const { calculatePricing } = require("../../helpers/pricing");
const { sendOrderInvoiceEmail } = require("../../helpers/mailer");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const buildOrderPayload = (req, coupon) => {
  const {
    userId,
    cartId,
    cartItems,
    addressInfo,
    orderStatus,
    paymentMethod,
    paymentStatus,
    orderDate,
    orderUpdateDate,
    paymentId,
    payerId,
    couponCode,
  } = req.body;

  const pricing = calculatePricing(cartItems, coupon);

  return {
    userId,
    cartId,
    cartItems,
    addressInfo,
    orderStatus,
    paymentMethod,
    paymentStatus,
    subtotalAmount: pricing.subtotalAmount,
    shippingAmount: pricing.shippingAmount,
    taxAmount: pricing.taxAmount,
    discountAmount: pricing.discountAmount,
    totalAmount: pricing.totalAmount,
    couponCode: couponCode ? couponCode.toUpperCase() : null,
    orderDate,
    orderUpdateDate,
    paymentId,
    payerId,
  };
};

const resolveCoupon = async (couponCode, cartItems) => {
  if (!couponCode) return null;

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  if (!coupon || !coupon.isActive) return null;

  const subtotal = (cartItems || []).reduce(
    (sum, item) =>
      sum +
      (Number(item.salePrice) > 0 ? Number(item.salePrice) : Number(item.price)) *
        Number(item.quantity),
    0
  );

  if (subtotal < coupon.minimumCartValue) return null;
  if (
    coupon.expirationDate &&
    new Date(coupon.expirationDate) < new Date()
  )
    return null;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return null;

  return coupon;
};

const applyStockDecrement = async (cartItems) => {
  for (let item of cartItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.totalStock < item.quantity) {
      throw new Error(`Not enough stock for product ${product.title}`);
    }
    product.totalStock -= item.quantity;
    await product.save();
  }
};

const restoreStock = async (cartItems) => {
  for (let item of cartItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.totalStock += item.quantity;
      await product.save();
    }
  }
};

const createOrder = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const coupon = await resolveCoupon(req.body.couponCode, cartItems);
    const pricing = calculatePricing(cartItems, coupon);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${CLIENT_URL}/shop/paypal-return`,
        cancel_url: `${CLIENT_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "INR",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "INR",
            total: pricing.totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const orderData = buildOrderPayload(req, coupon);
        const newlyCreatedOrder = new Order(orderData);

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Order already confirmed",
        data: order,
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await applyStockDecrement(order.cartItems);

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    try {
      const user = await User.findById(order.userId);
      if (user && user.email) await sendOrderInvoiceEmail(order, user.email);
    } catch (mailError) {
      console.log("Invoice email failed:", mailError);
    }

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e.message || "Some error occured!",
    });
  }
};

const createStripeOrder = async (req, res) => {
  try {
    const { cartItems, couponCode } = req.body;
    const coupon = await resolveCoupon(couponCode, cartItems);
    const orderData = buildOrderPayload(req, coupon);

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(
          (Number(item.salePrice) > 0 ? Number(item.salePrice) : Number(item.price)) *
            100
        ),
      },
      quantity: item.quantity,
    }));

    const newlyCreatedOrder = new Order(orderData);
    await newlyCreatedOrder.save();

    let session;
    try {
      const stripe = getStripeClient();
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        customer_email: req.body.email || undefined,
        metadata: {
          orderId: newlyCreatedOrder._id.toString(),
          userId: req.body.userId || "",
        },
        success_url: `${CLIENT_URL}/shop/payment-success?orderId=${newlyCreatedOrder._id}`,
        cancel_url: `${CLIENT_URL}/shop/checkout`,
      });
    } catch (stripeError) {
      console.log(stripeError);
      await Order.findByIdAndDelete(newlyCreatedOrder._id);
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured. Please use PayPal.",
      });
    }

    newlyCreatedOrder.paymentId = session.id;
    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      checkoutURL: session.url,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured while creating Stripe checkout!",
    });
  }
};

const captureStripePayment = async (req, res) => {
  try {
    const { orderId, sessionId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Order already confirmed",
        data: order,
      });
    }

    const session = await getStripeClient().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = session.id;
    order.stripePaymentIntentId = session.payment_intent;

    await applyStockDecrement(order.cartItems);

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    try {
      const user = await User.findById(order.userId);
      if (user && user.email) await sendOrderInvoiceEmail(order, user.email);
    } catch (mailError) {
      console.log("Invoice email failed:", mailError);
    }

    res.status(200).json({
      success: true,
      message: "Order confirmed",
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

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    if (
      ["shipped", "delivered"].includes(order.orderStatus) &&
      order.paymentStatus === "paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipped/delivered orders cannot be cancelled",
      });
    }

    let refundProcessed = false;

    if (order.paymentStatus === "paid") {
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
          const sale =
            payment?.transactions?.[0]?.related_resources?.[0]?.sale;
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
    }

    await restoreStock(order.cartItems);

    order.orderStatus = "cancelled";
    order.orderUpdateDate = new Date();
    order.refundStatus = refundProcessed ? "processed" : "requested";
    order.refundReason = "Order cancelled by customer";
    order.refundAmount = refundProcessed ? order.totalAmount : order.totalAmount;
    order.refundedAt = refundProcessed ? new Date() : undefined;

    await order.save();

    res.status(200).json({
      success: true,
      message: refundProcessed
        ? "Order cancelled and refund initiated"
        : "Order cancelled",
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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId }).sort({ orderDate: -1 }).skip(skip).limit(limit),
      Order.countDocuments({ userId }),
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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  createStripeOrder,
  captureStripePayment,
  cancelOrder,
  getAllOrdersByUser,
  getOrderDetails,
};
