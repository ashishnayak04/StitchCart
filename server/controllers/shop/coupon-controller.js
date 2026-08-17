const Coupon = require("../../models/Coupon");

const validateCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active",
      });
    }

    if (
      coupon.expirationDate &&
      new Date(coupon.expirationDate) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon has reached its usage limit",
      });
    }

    const amount = Number(cartAmount) || 0;

    if (amount < coupon.minimumCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart value of ₹${coupon.minimumCartValue.toLocaleString(
          "en-IN",
          { maximumFractionDigits: 2 }
        )} required for this coupon`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percent") {
      discountAmount = (amount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, amount);

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Number(discountAmount.toFixed(2)),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { validateCoupon };
