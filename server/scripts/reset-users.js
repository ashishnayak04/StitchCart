const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: __dirname + "/../.env" });
const User = require("../models/User");

async function resetUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} user(s)`);

    const adminPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await User.create({
      userName: "admin",
      email: "admin@stitchcart.com",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      phone: "9999999999",
    });

    console.log("\n--- Admin Credentials ---");
    console.log("Email:    admin@stitchcart.com");
    console.log("Password: Admin@123");
    console.log("Role:     admin");
    console.log("-------------------------\n");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

resetUsers();
