const express = require("express");
const Brand = require("../../models/Brand");
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: brands });
  } catch (e) { res.status(500).json({ success: false, message: "Error" }); }
});

module.exports = router;
