const express = require("express");
const {
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  updateProfile,
  googleAuth,
} = require("../../controllers/auth/auth-extra-controller");
const { authMiddleware } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-verification/:userId", authMiddleware, sendEmailVerification);
router.post("/verify-email", verifyEmail);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/google", googleAuth);

module.exports = router;
