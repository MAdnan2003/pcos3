// backend/routes/progressReports.js
import express from 'express';
import { 
  getProgressReports, 
  exportReport, 
  getMetricData 
} from '../controllers/progressReportsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/progress-reports
// @desc    Get progress reports for user
// @access  Private
router.get('/', auth, getProgressReports);

// @route   GET /api/progress-reports/export
// @desc    Export progress report as PDF
// @access  Private
router.get('/export', auth, exportReport);

// @route   GET /api/progress-reports/metric/:metricType
// @desc    Get specific metric data (mood, exercise, diet)
// @access  Private
router.get('/metric/:metricType', auth, getMetricData);

export default router;
