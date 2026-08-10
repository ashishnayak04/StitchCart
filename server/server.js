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

/* ===============================
   Server Start
================================= */
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT} 🚀`);
});
