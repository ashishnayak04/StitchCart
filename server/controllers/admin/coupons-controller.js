const Coupon = require("../../models/Coupon");
const { logAction } = require("./audit-log-controller");

const addCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumCartValue,
      expirationDate,
      usageLimit,
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: "code, discountType and discountValue are required",
      });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumCartValue,
      expirationDate,
      usageLimit,
    });

    await coupon.save();
    logAction(req.user?.id, "CREATE_COUPON", "Coupon", coupon._id.toString(), { code: coupon.code }, req.ip);

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const editCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumCartValue,
      expirationDate,
      usageLimit,
    } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found!",
      });
    }

    coupon.code = code ? code.toUpperCase() : coupon.code;
    coupon.description = description ?? coupon.description;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue =
      discountValue === "" || discountValue === undefined
        ? coupon.discountValue
        : discountValue;
    coupon.minimumCartValue = minimumCartValue ?? coupon.minimumCartValue;
    coupon.expirationDate = expirationDate ?? coupon.expirationDate;
    coupon.usageLimit = usageLimit ?? coupon.usageLimit;

    await coupon.save();
    logAction(req.user?.id, "UPDATE_COUPON", "Coupon", coupon._id.toString(), { code: coupon.code }, req.ip);

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const toggleCouponActive = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found!",
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found!",
      });
    }

    logAction(req.user?.id, "DELETE_COUPON", "Coupon", id, { code: coupon?.code }, req.ip);
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
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
  addCoupon,
  getAllCoupons,
  editCoupon,
  toggleCouponActive,
  deleteCoupon,
};
