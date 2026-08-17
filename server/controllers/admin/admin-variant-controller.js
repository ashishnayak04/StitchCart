const ProductVariant = require("../../models/ProductVariant");

const addVariant = async (req, res) => {
  try {
    const { productId, size, color, sku, stock, price, salePrice, image } = req.body;
    const variant = new ProductVariant({ productId, size, color, sku, stock, price, salePrice, image });
    await variant.save();
    res.status(201).json({ success: true, data: variant });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await ProductVariant.findByIdAndUpdate(id, req.body, { new: true });
    if (!variant) return res.status(404).json({ success: false, message: "Variant not found" });
    res.status(200).json({ success: true, data: variant });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductVariant.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Variant deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getVariantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await ProductVariant.find({ productId });
    res.status(200).json({ success: true, data: variants });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addVariant, updateVariant, deleteVariant, getVariantsByProduct };
