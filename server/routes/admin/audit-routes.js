const express = require("express");
const { getAuditLogs } = require("../../controllers/admin/audit-log-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getAuditLogs);

module.exports = router;
