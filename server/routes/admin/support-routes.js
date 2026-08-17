const express = require("express");
const {
  getAllTickets,
  updateTicketStatus,
  adminReply,
} = require("../../controllers/admin/admin-support-controller");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getAllTickets);
router.put("/:id/status", authMiddleware, adminMiddleware, updateTicketStatus);
router.post("/:id/reply", authMiddleware, adminMiddleware, adminReply);

module.exports = router;
