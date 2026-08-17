const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../../controllers/shop/notification-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get/:userId", authMiddleware, getNotifications);
router.put("/read/:id", authMiddleware, markAsRead);
router.put("/read-all/:userId", authMiddleware, markAllAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
