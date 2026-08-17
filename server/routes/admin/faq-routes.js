const express = require("express");
const {
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getAllFAQs,
} = require("../../controllers/admin/admin-faq-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addFAQ);
router.get("/get", authMiddleware, adminMiddleware, getAllFAQs);
router.put("/edit/:id", authMiddleware, adminMiddleware, updateFAQ);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteFAQ);

module.exports = router;
