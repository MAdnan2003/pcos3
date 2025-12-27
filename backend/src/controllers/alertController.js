import Alert from "../models/Alert.js";

/* =========================
   GET ALL ACTIVE ALERTS
========================= */
export const getAlerts = async (req, res) => {
  try {
    const { isRead, severity, type } = req.query;

    const query = {
      userId: req.userId,
      isActive: true
    };

    if (isRead !== undefined) query.isRead = isRead === "true";
    if (severity) query.severity = severity;
    if (type) query.type = type;

    const alerts = await Alert.find(query)
      .sort({ triggeredAt: -1 })
      .limit(50);

    const unreadCount = await Alert.countDocuments({
      userId: req.userId,
      isActive: true,
      isRead: false
    });

    res.json({
      message: "Alerts retrieved successfully",
      alerts,
      unreadCount
    });
  } catch (error) {
    console.error("Get Alerts Error:", error);
    res.status(500).json({
      message: "Failed to fetch alerts",
      error: error.message
    });
  }
};

/* =========================
   MARK ALERT AS READ
========================= */
export const markAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId: req.userId },
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({
      message: "Alert marked as read",
      alert
    });
  } catch (error) {
    console.error("Mark Alert Read Error:", error);
    res.status(500).json({
      message: "Failed to update alert",
      error: error.message
    });
  }
};

/* =========================
   MARK ALL ALERTS AS READ
========================= */
export const markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.userId, isActive: true, isRead: false },
      { isRead: true }
    );

    res.json({
      message: "All alerts marked as read"
    });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    res.status(500).json({
      message: "Failed to update alerts",
      error: error.message
    });
  }
};

/* =========================
   DISMISS ALERT
========================= */
export const dismissAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId: req.userId },
      { isActive: false },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({
      message: "Alert dismissed",
      alert
    });
  } catch (error) {
    console.error("Dismiss Alert Error:", error);
    res.status(500).json({
      message: "Failed to dismiss alert",
      error: error.message
    });
  }
};

/* =========================
   ALERT STATISTICS
========================= */
export const getAlertStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const alerts = await Alert.find({
      userId: req.userId,
      triggeredAt: { $gte: startDate }
    });

    const stats = {
      total: alerts.length,
      bySeverity: {
        info: alerts.filter(a => a.severity === "info").length,
        warning: alerts.filter(a => a.severity === "warning").length,
        danger: alerts.filter(a => a.severity === "danger").length,
        critical: alerts.filter(a => a.severity === "critical").length
      },
      byType: {
        airQuality: alerts.filter(a => a.type === "air-quality").length,
        weather: alerts.filter(a => a.type === "weather").length,
        pollution: alerts.filter(a => a.type === "pollution").length,
        combined: alerts.filter(a => a.type === "combined").length
      },
      unread: alerts.filter(a => !a.isRead && a.isActive).length
    };

    res.json({
      message: "Alert statistics retrieved",
      period: { days: parseInt(days), startDate },
      stats
    });
  } catch (error) {
    console.error("Get Alert Stats Error:", error);
    res.status(500).json({
      message: "Failed to fetch statistics",
      error: error.message
    });
  }
};
