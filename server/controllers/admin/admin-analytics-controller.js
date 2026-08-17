const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");
const ProductReview = require("../../models/Review");
const Cart = require("../../models/Cart");
const Coupon = require("../../models/Coupon");
const AuditLog = require("../../models/AuditLog");

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalOrders,
      totalProducts,
      totalUsers,
      revenueResult,
      recentOrders,
      lowStockProducts,
      ordersByStatus,
      todayOrders,
      todayRevenueResult,
      monthRevenueResult,
      lastMonthRevenueResult,
      pendingOrders,
      pendingReturns,
      unreadTickets,
      abandonedCarts,
      recentActivity,
    ] = await Promise.all([
      Order.countDocuments({}),
      Product.countDocuments({}),
      User.countDocuments({ role: "user" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find({}).sort({ createdAt: -1 }).limit(5).populate("userId", "userName email"),
      Product.find({ totalStock: { $lte: 5 } }).sort({ totalStock: 1 }).limit(10),
      Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
      Order.countDocuments({ orderDate: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid", orderDate: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", orderDate: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", orderDate: { $gte: lastMonthStart }, orderDate: { $lt: monthStart } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ returnStatus: "requested" }),
      require("../../models/Notification").countDocuments({ isRead: false }),
      Cart.countDocuments({}),
      AuditLog.find({}).sort({ createdAt: -1 }).limit(5).populate("userId", "userName"),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].total : 0;
    const monthRevenue = monthRevenueResult.length > 0 ? monthRevenueResult[0].total : 0;
    const lastMonthRevenue = lastMonthRevenueResult.length > 0 ? lastMonthRevenueResult[0].total : 0;
    const revenueChange = lastMonthRevenue > 0 ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;

    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        todayOrders,
        todayRevenue,
        monthRevenue,
        revenueChange: Number(revenueChange),
        avgOrderValue: Number(avgOrderValue),
        recentOrders,
        lowStockProducts,
        ordersByStatus,
        pendingOrders,
        pendingReturns,
        unreadTickets,
        abandonedCarts,
        recentActivity,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getRevenueChart = async (req, res) => {
  try {
    const { period = "30", startDate, endDate } = req.query;
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    } else {
      const days = parseInt(period, 10) || 30;
      const start = new Date();
      start.setDate(start.getDate() - days);
      dateFilter = { orderDate: { $gte: start } };
    }

    const data = await Order.aggregate([
      { $match: { paymentStatus: "paid", ...dateFilter } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getRevenueByCategory = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$cartItems" },
      { $lookup: { from: "products", localField: "cartItems.productId", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$product.category", revenue: { $sum: { $multiply: [{ $toDouble: "$cartItems.price" }, "$cartItems.quantity"] } }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
    ]);
    res.status(200).json({ success: true, data });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getRevenueByBrand = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$cartItems" },
      { $lookup: { from: "products", localField: "cartItems.productId", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$product.brand", revenue: { $sum: { $multiply: [{ $toDouble: "$cartItems.price" }, "$cartItems.quantity"] } }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
    ]);
    res.status(200).json({ success: true, data });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getCouponPerformance = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { couponCode: { $ne: null }, paymentStatus: "paid" } },
      { $group: { _id: "$couponCode", orders: { $sum: 1 }, totalDiscount: { $sum: "$discountAmount" }, totalRevenue: { $sum: "$totalAmount" } } },
      { $sort: { orders: -1 } },
    ]);
    res.status(200).json({ success: true, data });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$cartItems" },
      { $group: { _id: "$cartItems.productId", title: { $first: "$cartItems.title" }, totalSold: { $sum: "$cartItems.quantity" }, revenue: { $sum: { $multiply: [{ $toDouble: "$cartItems.price" }, "$cartItems.quantity"] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);
    res.status(200).json({ success: true, data: topProducts });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getAllCustomers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;
    const { search } = req.query;

    let filter = { role: "user" };
    if (search) {
      const regEx = new RegExp(search, "i");
      filter.$or = [{ userName: regEx }, { email: regEx }, { phone: regEx }];
    }

    const [customers, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    const customersWithStats = await Promise.all(
      customers.map(async (c) => {
        const [orderCount, totalSpent] = await Promise.all([
          Order.countDocuments({ userId: c._id.toString() }),
          Order.aggregate([
            { $match: { userId: c._id.toString(), paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ]),
        ]);
        return {
          ...c._doc,
          orderCount,
          totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        };
      })
    );

    res.status(200).json({ success: true, data: customersWithStats, total, totalPages: Math.ceil(total / limit), page, limit });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const [orders, totalOrders, totalSpent, wishlist, loyalty] = await Promise.all([
      Order.find({ userId: id }).sort({ orderDate: -1 }).limit(20),
      Order.countDocuments({ userId: id }),
      Order.aggregate([
        { $match: { userId: id, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      require("../../models/Wishlist").find({ userId: id }).populate("productId", "title image price"),
      require("../../models/LoyaltyPoint").findOne({ userId: id }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        orders,
        totalOrders,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        wishlist: wishlist.filter((w) => w.productId),
        loyalty: loyalty || { points: 0, history: [] },
      },
    });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.role = user.role === "blocked" ? "user" : "blocked";
    await user.save();
    res.status(200).json({ success: true, data: { role: user.role } });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

module.exports = {
  getDashboardStats,
  getRevenueChart,
  getRevenueByCategory,
  getRevenueByBrand,
  getCouponPerformance,
  getTopProducts,
  getAllCustomers,
  getCustomerDetails,
  blockUser,
};
