import * as Lead from '../models/Lead.js';

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.createLead(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all leads (admin sees all, others see only their assigned leads)
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.getAllLeads(req.user);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single lead by ID
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a lead
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.updateLead(req.params.id, req.body);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a lead
export const deleteLead = async (req, res) => {
  try {
    await Lead.deleteLead(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 