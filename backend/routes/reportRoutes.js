import express from 'express';
import { getUsersByRole, getLeadsByStatus, getDealsByStage, getContactsByCompany, getAllReports, createReport, updateReport, deleteReport, getTotalRevenue, getRevenueByMonth, getTopPerformers, getHighestDeal, getReportById } from '../controllers/reportController.js';

const router = express.Router();

// GET /api/reports/users-by-role
router.get('/reports/users-by-role', getUsersByRole);
// GET /api/reports/leads-by-status
router.get('/reports/leads-by-status', getLeadsByStatus);
// GET /api/reports/deals-by-stage
router.get('/reports/deals-by-stage', getDealsByStage);
// GET /api/reports/contacts-by-company
router.get('/reports/contacts-by-company', getContactsByCompany);
// GET /api/reports
router.get('/reports', getAllReports);
// GET /api/reports/total-revenue
router.get('/reports/total-revenue', getTotalRevenue);
// GET /api/reports/revenue-by-month
router.get('/reports/revenue-by-month', getRevenueByMonth);
// GET /api/reports/top-performers
router.get('/reports/top-performers', getTopPerformers);
// GET /api/reports/highest-deal
router.get('/reports/highest-deal', getHighestDeal);
// GET /api/reports/:id
router.get('/reports/:id', getReportById);
// POST /api/reports
router.post('/reports', createReport);
// PUT /api/reports/:id
router.put('/reports/:id', updateReport);
// DELETE /api/reports/:id
router.delete('/reports/:id', deleteReport);

export default router; 