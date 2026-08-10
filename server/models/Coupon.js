const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: String,
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
      default: "percent",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumCartValue: {
      type: Number,
      default: 0,
    },
    expirationDate: Date,
    usageLimit: {
      type: Number,
      default: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);
