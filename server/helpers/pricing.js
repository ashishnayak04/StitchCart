const calculatePricing = (cartItems, coupon = null) => {
  const subtotalAmount = (cartItems || []).reduce(
    (sum, item) =>
      sum +
      (Number(item.salePrice) > 0 ? Number(item.salePrice) : Number(item.price)) *
        Number(item.quantity),
    0
  );

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === "percent") {
      discountAmount = (subtotalAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, subtotalAmount);
  }

  const shippingAmount = Number(process.env.SHIPPING_FLAT_RATE) || 0;
  const taxableAmount = subtotalAmount - discountAmount;
  const taxRate = Number(process.env.US_TAX_RATE) || 0;
  const taxAmount = taxableAmount * taxRate;

  const totalAmount =
    subtotalAmount - discountAmount + shippingAmount + taxAmount;

  return {
    subtotalAmount: Number(subtotalAmount.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    shippingAmount: Number(shippingAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};

module.exports = { calculatePricing };
