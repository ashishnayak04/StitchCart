const mongoose = require("mongoose");

const RecentlyViewedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

RecentlyViewedSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("RecentlyViewed", RecentlyViewedSchema);
