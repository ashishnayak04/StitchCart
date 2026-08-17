const mongoose = require("mongoose");

const ProductVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: String,
    color: String,
    sku: String,
    stock: { type: Number, default: 0 },
    price: Number,
    salePrice: Number,
    image: String,
  },
  { timestamps: true }
);

ProductVariantSchema.index({ productId: 1, size: 1, color: 1 }, { unique: true });

module.exports = mongoose.model("ProductVariant", ProductVariantSchema);
