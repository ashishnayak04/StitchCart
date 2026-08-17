const express = require("express");
const { addCategory, getAllCategories, updateCategory, deleteCategory } = require("../../controllers/admin/category-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");
const { upload } = require("../../helpers/cloudinary");
const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addCategory);
router.get("/get", getAllCategories);
router.put("/edit/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteCategory);
router.post("/upload-image", authMiddleware, adminMiddleware, upload.single("my_file"), async (req, res) => {
  const { imageUploadUtil } = require("../../helpers/cloudinary");
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.json({ success: true, result });
  } catch (error) { console.log(error); res.json({ success: false, message: "Error" }); }
});

module.exports = router;
