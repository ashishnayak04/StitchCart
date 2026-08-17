const express = require("express");
const {
  addPolicy,
  updatePolicy,
  deletePolicy,
  getAllPolicies,
} = require("../../controllers/admin/admin-policy-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addPolicy);
router.get("/get", authMiddleware, adminMiddleware, getAllPolicies);
router.put("/edit/:id", authMiddleware, adminMiddleware, updatePolicy);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deletePolicy);

module.exports = router;
