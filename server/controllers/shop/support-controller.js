const SupportTicket = require("../../models/SupportTicket");

const createTicket = async (req, res) => {
  try {
    const { userId, orderId, subject, message, priority } = req.body;
    if (!userId || !subject || !message) {
      return res.status(400).json({ success: false, message: "userId, subject, and message required" });
    }

    const ticket = new SupportTicket({ userId, orderId, subject, message, priority });
    await ticket.save();
    res.status(201).json({ success: true, data: ticket });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await SupportTicket.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getTicketDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findById(id).populate("replies.userId", "userName email");
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, message } = req.body;
    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    ticket.replies.push({ userId, message });
    if (ticket.status === "open") ticket.status = "in_progress";
    await ticket.save();
    res.status(200).json({ success: true, data: ticket });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findByIdAndUpdate(id, { status: "closed" }, { new: true });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { createTicket, getUserTickets, getTicketDetails, addReply, closeTicket };
