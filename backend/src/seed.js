import dotenv from "dotenv";
import { connectDB, closeDB } from "./config/db.js";

// MODELS
import Stats from "./models/Stats.js";
import User from "./models/User.js";
import Report from "./models/Report.js";
import Activity from "./models/Activity.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    // =========================
    // CLEAR COLLECTIONS
    // =========================
    await Stats.deleteMany({});
    await User.deleteMany({});
    await Report.deleteMany({});
    await Activity.deleteMany({});

    // =========================
    // DASHBOARD STATS
    // =========================
    await Stats.insertMany([
      { title: "Total Users", value: 2847 },
      { title: "Active Posts", value: 1234 },
      { title: "Open Reports", value: 23 },
      { title: "Engagement Rate (%)", value: 78 }
    ]);

    // =========================
    // USERS
    // =========================

    // 🔐 ADMIN USER
    // Email ends with @admin.com → role = admin (auto)
    await User.create({
      name: "Admin User",
      email: "admin@admin.com",
      password: "admin123", // hashed automatically
      status: "active",
      posts: 0
    });

    // 👤 REGULAR USERS
    await User.insertMany([
      {
        name: "Emma Wilson",
        email: "emma@example.com",
        password: "password123",
        status: "active",
        joinDate: new Date(),
        posts: 12
      },
      {
        name: "Jason Lee",
        email: "jason@example.com",
        password: "password123",
        status: "active",
        joinDate: new Date(Date.now() - 86400000),
        posts: 5
      },
      {
        name: "Ava Martinez",
        email: "ava@example.com",
        password: "password123",
        status: "suspended",
        joinDate: new Date(Date.now() - 3 * 86400000),
        posts: 8
      },
      {
        name: "Noah Davis",
        email: "noah@example.com",
        password: "password123",
        status: "active",
        joinDate: new Date(Date.now() - 7 * 86400000),
        posts: 2
      }
    ]);

    // =========================
    // REPORTS
    // =========================
    await Report.insertMany([
      {
        type: "Content Issue",
        reportedBy: "Sarah Johnson",
        content: "Post contains misinformation.",
        status: "pending",
        priority: "high",
        date: new Date()
      },
      {
        type: "Abusive Behavior",
        reportedBy: "Jason Lee",
        content: "User used inappropriate language.",
        status: "reviewing",
        priority: "medium",
        date: new Date(Date.now() - 3600000)
      },
      {
        type: "Bug Report",
        reportedBy: "Emily Chen",
        content: "App crashes while uploading content.",
        status: "resolved",
        priority: "low",
        date: new Date(Date.now() - 86400000)
      }
    ]);

    // =========================
    // ACTIVITY FEED
    // =========================
    const now = new Date();

    await Activity.insertMany([
      {
        actorName: "Sarah Johnson",
        action: "Reported content issue",
        createdAt: new Date(now - 2 * 60000)
      },
      {
        actorName: "Emily Chen",
        action: "Created new wellness article",
        createdAt: new Date(now - 15 * 60000)
      },
      {
        actorName: "Michael Brown",
        action: "Registered new account",
        createdAt: new Date(now - 60 * 60000)
      },
      {
        actorName: "Lisa Anderson",
        action: "Updated profile information",
        createdAt: new Date(now - 2 * 3600000)
      }
    ]);

    console.log("🌱 Database seeded successfully!");
    console.log("🔐 Admin login:");
    console.log("   email: admin@admin.com");
    console.log("   password: admin123");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

seed();
