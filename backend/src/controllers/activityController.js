import Activity from "../models/Activity.js";

export const getRecentActivity = async (req, res) => {
  try {
    const activity = await Activity.find().sort({ createdAt: -1 }).limit(10);

    res.json(activity);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};
