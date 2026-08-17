const express = require("express");
const {
  createTicket,
  getUserTickets,
  getTicketDetails,
  addReply,
  closeTicket,
} = require("../../controllers/shop/support-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/create", authMiddleware, createTicket);
router.get("/user/:userId", authMiddleware, getUserTickets);
router.get("/:id", authMiddleware, getTicketDetails);
router.post("/:id/reply", authMiddleware, addReply);
router.put("/:id/close", authMiddleware, closeTicket);

module.exports = router;
