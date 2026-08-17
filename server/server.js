require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminCouponRouter = require("./routes/admin/coupons-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopCouponRouter = require("./routes/shop/coupon-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// Phase 2 - Auth extras
const authExtraRouter = require("./routes/auth/auth-extra-routes");
const wishlistRouter = require("./routes/shop/wishlist-routes");
const recentlyViewedRouter = require("./routes/shop/recently-viewed-routes");
const loyaltyRouter = require("./routes/shop/loyalty-routes");
const reorderRouter = require("./routes/shop/reorder-routes");
const variantRouter = require("./routes/shop/variant-routes");
const trackingRouter = require("./routes/shop/tracking-routes");
const returnRouter = require("./routes/shop/return-routes");

// Phase 3 - Notifications
const notificationRouter = require("./routes/shop/notification-routes");

// Phase 4 - Admin
const analyticsRouter = require("./routes/admin/analytics-routes");
const reviewModRouter = require("./routes/admin/review-moderation-routes");
const adminSupportRouter = require("./routes/admin/support-routes");
const adminFaqRouter = require("./routes/admin/faq-routes");
const adminPolicyRouter = require("./routes/admin/policy-routes");
const auditRouter = require("./routes/admin/audit-routes");
const adminVariantRouter = require("./routes/admin/variant-routes");
const exportRouter = require("./routes/admin/export-routes");
const adminCategoryRouter = require("./routes/admin/category-routes");
const adminBrandRouter = require("./routes/admin/brand-routes");
const adminInventoryRouter = require("./routes/admin/inventory-routes");
const adminReturnAdminRouter = require("./routes/admin/return-admin-routes");
const adminUserMgmtRouter = require("./routes/admin/user-management-routes");
const shopCategoryRouter = require("./routes/shop/category-routes");
const shopBrandRouter = require("./routes/shop/brand-routes");

// Phase 5 - Support
const supportRouter = require("./routes/shop/support-routes");
const faqRouter = require("./routes/shop/faq-routes");
const policyRouter = require("./routes/shop/policy-routes");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

/* ===============================
   MongoDB Connection
================================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully ✅"))
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.log(error);
  });

/* ===============================
   Middlewares
================================= */
app.use(helmet());

app.use(
  cors({
    origin: corsOrigin.split(",").map((o) => o.trim()), // frontend Vite default port
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

/* ===============================
   Routes
================================= */
app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/coupons", adminCouponRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/coupon", shopCouponRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.use("/api/auth", authExtraRouter);
app.use("/api/shop/wishlist", wishlistRouter);
app.use("/api/shop/recently-viewed", recentlyViewedRouter);
app.use("/api/shop/loyalty", loyaltyRouter);
app.use("/api/shop/reorder", reorderRouter);
app.use("/api/shop/variants", variantRouter);
app.use("/api/shop/tracking", trackingRouter);
app.use("/api/shop/returns", returnRouter);
app.use("/api/shop/notifications", notificationRouter);
app.use("/api/shop/support", supportRouter);
app.use("/api/shop/faq", faqRouter);
app.use("/api/shop/policies", policyRouter);

app.use("/api/admin/analytics", analyticsRouter);
app.use("/api/admin/reviews", reviewModRouter);
app.use("/api/admin/support", adminSupportRouter);
app.use("/api/admin/faq", adminFaqRouter);
app.use("/api/admin/policies", adminPolicyRouter);
app.use("/api/admin/audit", auditRouter);
app.use("/api/admin/variants", adminVariantRouter);
app.use("/api/admin/export", exportRouter);
app.use("/api/admin/categories", adminCategoryRouter);
app.use("/api/admin/brands", adminBrandRouter);
app.use("/api/admin/inventory", adminInventoryRouter);
app.use("/api/admin/returns", adminReturnAdminRouter);
app.use("/api/admin/users", adminUserMgmtRouter);
app.use("/api/shop/categories", shopCategoryRouter);
app.use("/api/shop/brands", shopBrandRouter);

/* ===============================
   Server Start
================================= */
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT} 🚀`);
});
