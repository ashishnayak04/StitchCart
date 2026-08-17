const express = require("express");
const { getInventoryOverview, updateStock, bulkUpdateStock } = require("../../controllers/admin/inventory-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");
const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getInventoryOverview);
router.put("/update/:id", authMiddleware, adminMiddleware, updateStock);
router.put("/bulk-update", authMiddleware, adminMiddleware, bulkUpdateStock);

module.exports = router;
