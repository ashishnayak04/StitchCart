const AuditLog = require("../../models/AuditLog");

const logAction = async (userId, action, entity, entityId, details, ipAddress) => {
  try {
    const log = new AuditLog({ userId, action, entity, entityId, details, ipAddress });
    await log.save();
  } catch (e) {
    console.log("Audit log error:", e);
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 50, 1);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find({}).populate("userId", "userName email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments({}),
    ]);

    res.status(200).json({ success: true, data: logs, total, totalPages: Math.ceil(total / limit), page, limit });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { logAction, getAuditLogs };
