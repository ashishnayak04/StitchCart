const express = require("express");
const Category = require("../../models/Category");
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (e) { res.status(500).json({ success: false, message: "Error" }); }
});

module.exports = router;
