const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const { search, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const createUser = async (req, res) => {
  try {
    const { userName, email, password, role, phone } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ success: false, message: "userName, email and password are required!" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists!" });
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ success: false, message: "userName already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      email,
      password: hashedPassword,
      role: role || "user",
      phone: phone || "",
    });

    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, phone, role } = req.body;

    if (String(req.user._id) === String(id) && role && role !== req.user.role) {
      return res.status(400).json({ success: false, message: "You cannot change your own role!" });
    }

    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email already exists!" });
      }
    }

    if (userName) {
      const existingUserName = await User.findOne({ userName, _id: { $ne: id } });
      if (existingUserName) {
        return res.status(400).json({ success: false, message: "userName already exists!" });
      }
    }

    const updateData = {};
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account!" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({ success: false, message: "You cannot block your own account!" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    user.role = user.role === "blocked" ? "user" : "blocked";
    await user.save();

    res.status(200).json({
      success: true,
      message: user.role === "blocked" ? "User blocked successfully!" : "User unblocked successfully!",
      data: { _id: user._id, role: user.role },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  createUser,
  updateUser,
  deleteUser,
  toggleBlockUser,
};
