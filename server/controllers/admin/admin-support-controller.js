const SupportTicket = require("../../models/SupportTicket");
const { logAction } = require("./audit-log-controller");

const getAllTickets = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const tickets = await SupportTicket.find(filter)
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(id, { status }, { new: true });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    logAction(req.user?.id, "UPDATE_TICKET_STATUS", "SupportTicket", id, { status }, req.ip);
    res.status(200).json({ success: true, data: ticket });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const adminReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, message } = req.body;
    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    ticket.replies.push({ userId, message });
    ticket.status = "in_progress";
    await ticket.save();
    res.status(200).json({ success: true, data: ticket });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { getAllTickets, updateTicketStatus, adminReply };
