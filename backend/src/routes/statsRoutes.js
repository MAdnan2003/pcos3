import express from "express";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Activity from "../models/Activity.js";

// ✅ Community posts model
import ForumPost from "../models/ForumPost.js";

const router = express.Router();

/* =========================
   DASHBOARD METRICS
========================= */
router.get("/", async (req, res) => {
  try {
    // ======================
    // REQUIRED COUNTS
    // ======================
    const totalUsers = await User.countDocuments();
    const openReports = await Report.countDocuments({ status: "pending" });

    // ⚠️ IMPORTANT:
    // Active Content SHOULD reflect real content,
    // not internal activity logs (logins, views, etc.)

    // ✅ COUNT ONLY COMMUNITY POSTS
    const forumPostsCount = await ForumPost.countDocuments();

    // ✅ FIXED ACTIVE CONTENT
    const activeContent = forumPostsCount;

    // ======================
    // ENGAGEMENT RATE
    // ======================
    const engagementRate =
      totalUsers > 0
        ? ((activeContent / totalUsers) * 100).toFixed(1)
        : 0;

    // ======================
    // FAKE % CHANGE (UI ONLY)
    // ======================
    const randomChange = () =>
      Math.floor(Math.random() * 30) - 10; // -10% → +20%

    // ======================
    // RESPONSE
    // ======================
    res.json({
      totalUsers,
      activeContent,
      openReports,
      engagementRate,

      totalUsersChange: randomChange(),
      activeContentChange: randomChange(),
      openReportsChange: randomChange(),
      engagementRateChange: randomChange(),
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});

/* =========================
   RECENT ACTIVITY (REAL DATA)
========================= */
router.get("/recent-activity", async (req, res) => {
  try {
    // Get latest community posts
    const recentPosts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    // Format for frontend component
    const formattedActivity = recentPosts.map((post) => ({
      user: post.userId?.name || post.userId?.email || "Unknown User",
      action: "posted in Community",
      date: post.createdAt,
      content: post.title || post.content?.slice(0, 40) || "New post",
    }));

    res.json(formattedActivity);
  } catch (error) {
    console.error("Recent Activity Error:", error);
    res.status(500).json({ message: "Failed to load recent activity" });
  }
});

export default router;
