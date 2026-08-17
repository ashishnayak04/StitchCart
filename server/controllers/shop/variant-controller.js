const ProductVariant = require("../../models/ProductVariant");

const getVariants = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await ProductVariant.find({ productId });
    res.status(200).json({ success: true, data: variants });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { getVariants };
