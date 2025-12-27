import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "admin@admin.com";

    // ❌ Prevent duplicate admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Super Admin",
      email: adminEmail,
      password: "Admin@123", // will be hashed automatically
      location: {
        city: "Dhaka",
        latitude: 23.8103,
        longitude: 90.4125
      }
    });

    await admin.save();

    console.log("✅ Admin user created successfully");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Admin seed failed:", error);
    process.exit(1);
  }
};

seedAdmin();
