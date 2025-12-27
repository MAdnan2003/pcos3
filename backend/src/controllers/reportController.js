import Report from "../models/Report.js";

// Get all reports
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Set status to "reviewing"
export const setReview = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        report.status = "reviewing";
        await report.save();
        res.json({ message: "Report set to reviewing" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Set status to "resolved"
export const resolveReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        report.status = "resolved";
        await report.save();
        res.json({ message: "Report resolved" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a report
export const deleteReport = async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: "Report deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
