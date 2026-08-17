const Brand = require("../../models/Brand");
const { logAction } = require("./audit-log-controller");

const addBrand = async (req, res) => {
  try {
    const { name, slug, logo, description, sortOrder } = req.body;
    const existing = await Brand.findOne({ $or: [{ name }, { slug }] });
    if (existing) return res.status(400).json({ success: false, message: "Brand already exists" });
    const brand = new Brand({ name, slug, logo, description, sortOrder });
    await brand.save();
    logAction(req.user?.id, "CREATE_BRAND", "Brand", brand._id.toString(), { name }, req.ip);
    res.status(201).json({ success: true, data: brand });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, data: brands });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    if (!brand) return res.status(404).json({ success: false, message: "Not found" });
    logAction(req.user?.id, "UPDATE_BRAND", "Brand", id, {}, req.ip);
    res.status(200).json({ success: true, data: brand });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await Brand.findByIdAndDelete(id);
    logAction(req.user?.id, "DELETE_BRAND", "Brand", id, {}, req.ip);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

module.exports = { addBrand, getAllBrands, updateBrand, deleteBrand };
