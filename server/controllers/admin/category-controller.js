const Category = require("../../models/Category");
const { logAction } = require("./audit-log-controller");

const addCategory = async (req, res) => {
  try {
    const { name, slug, description, image, sortOrder } = req.body;
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) return res.status(400).json({ success: false, message: "Category already exists" });
    const category = new Category({ name, slug, description, image, sortOrder });
    await category.save();
    logAction(req.user?.id, "CREATE_CATEGORY", "Category", category._id.toString(), { name }, req.ip);
    res.status(201).json({ success: true, data: category });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Not found" });
    logAction(req.user?.id, "UPDATE_CATEGORY", "Category", id, {}, req.ip);
    res.status(200).json({ success: true, data: category });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    logAction(req.user?.id, "DELETE_CATEGORY", "Category", id, {}, req.ip);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (e) { console.log(e); res.status(500).json({ success: false, message: "Error" }); }
};

module.exports = { addCategory, getAllCategories, updateCategory, deleteCategory };
