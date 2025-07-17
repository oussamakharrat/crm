import { Report } from '../models/Report.js';

export const getUsersByRole = async (req, res) => {
  try {
    const rows = await Report.usersByRole();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users by role', details: err.message });
  }
};

export const getLeadsByStatus = async (req, res) => {
  try {
    const rows = await Report.leadsByStatus();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads by status', details: err.message });
  }
};

export const getDealsByStage = async (req, res) => {
  try {
    const rows = await Report.dealsByStage();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deals by stage', details: err.message });
  }
};

export const getContactsByCompany = async (req, res) => {
  try {
    const rows = await Report.contactsByCompany();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts by company', details: err.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const rows = await Report.allReports();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports metadata', details: err.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const { name, description, type, parameters, created_by } = req.body;
    const report = await Report.createReport({ name, description, type, parameters, created_by });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create report', details: err.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, parameters } = req.body;
    const report = await Report.updateReport(id, { name, description, type, parameters });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update report', details: err.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.deleteReport(id);
    res.json({ message: 'Report deleted', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report', details: err.message });
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    const row = await Report.totalRevenue();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch total revenue', details: err.message });
  }
};

export const getRevenueByMonth = async (req, res) => {
  try {
    const rows = await Report.revenueByMonth();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch revenue by month', details: err.message });
  }
};

export const getTopPerformers = async (req, res) => {
  try {
    const rows = await Report.topPerformers();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top performers', details: err.message });
  }
};

export const getHighestDeal = async (req, res) => {
  try {
    const row = await Report.highestDeal();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch highest deal', details: err.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.getReportById(id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report', details: err.message });
  }
}; 