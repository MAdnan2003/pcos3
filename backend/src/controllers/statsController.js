import Stats from "../models/Stats.js";

export const getStats = async (req, res) => {
  try {
    const stats = await Stats.find();

    // Convert DB list → object structure expected by dashboard
    const result = {
      totalUsers: stats.find(s => s.title === "Total Users")?.value || 0,
      totalUsersChange: 12.5,

      activeContent: stats.find(s => s.title === "Active Content")?.value || 0,
      activeContentChange: 8.2,

      openReports: stats.find(s => s.title === "Open Reports")?.value || 0,
      openReportsChange: -15.3,

      engagementRate: stats.find(s => s.title === "Engagement Rate")?.value || 0,
      engagementRateChange: 3.1
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
