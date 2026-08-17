const express = require("express");
const { authMiddleware, adminMiddleware } = require("../../middleware/auth-middleware");
const {
  getAllUsers,
  getUserDetails,
  createUser,
  updateUser,
  deleteUser,
  toggleBlockUser,
} = require("../../controllers/admin/user-management-controller");

const router = express.Router();

router.get("/get", authMiddleware, adminMiddleware, getAllUsers);
router.get("/details/:id", authMiddleware, adminMiddleware, getUserDetails);
router.post("/add", authMiddleware, adminMiddleware, createUser);
router.put("/update/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/toggle-block/:id", authMiddleware, adminMiddleware, toggleBlockUser);

module.exports = router;
