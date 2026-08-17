const Product = require("../../models/Product");
const ProductVariant = require("../../models/ProductVariant");

const getInventoryOverview = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;
    const { search, lowStock } = req.query;

    let filter = {};
    if (search) {
      const regEx = new RegExp(search, "i");
      filter.$or = [{ title: regEx }, { category: regEx }, { brand: regEx }];
    }
    if (lowStock === "true") {
      filter.totalStock = { $lte: 10 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ totalStock: 1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    const productIds = products.map((p) => p._id);
    const variants = await ProductVariant.find({ productId: { $in: productIds } });

    const data = products.map((p) => {
      const pVariants = variants.filter((v) => v.productId.toString() === p._id.toString());
      const variantStock = pVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      return {
        ...p._doc,
        variantCount: pVariants.length,
        variantStock,
        totalAvailableStock: p.totalStock + variantStock,
      };
    });

    res.status(200).json({ success: true, data, total, totalPages: Math.ceil(total / limit), page, limit });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalStock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { totalStock }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: product });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // [{productId, totalStock}]
    const ops = updates.map((u) => ({
      updateOne: { filter: { _id: u.productId }, update: { totalStock: u.totalStock } },
    }));
    await Product.bulkWrite(ops);
    res.status(200).json({ success: true, message: `${updates.length} products updated` });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

module.exports = { getInventoryOverview, updateStock, bulkUpdateStock };
