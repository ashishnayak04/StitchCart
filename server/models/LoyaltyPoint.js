const mongoose = require("mongoose");

const LoyaltyPointSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: { type: Number, default: 0 },
    history: [
      {
        type: { type: String, enum: ["earned", "redeemed"] },
        amount: Number,
        description: String,
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

LoyaltyPointSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("LoyaltyPoint", LoyaltyPointSchema);
