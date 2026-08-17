const express = require("express");
const { getReturnRequests, processReturn } = require("../../controllers/admin/return-admin-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");
const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getReturnRequests);
router.put("/process/:id", authMiddleware, adminMiddleware, processReturn);

module.exports = router;
