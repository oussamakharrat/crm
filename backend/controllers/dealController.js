import { Deal } from '../models/Deal.js';
import { Invoice } from '../models/Invoice.js';
import { Notification } from '../models/Notification.js';
import { UserDetails } from '../models/User.js';
import { generateInvoicePdf } from '../utils/invoicePdf.js';
import db from '../config/db.js';

function hasRole(roles, ...required) {
  return roles && required.some(r => roles.map(role => role.toLowerCase()).includes(r.toLowerCase()));
}

// GET /deals
export const getAllDeals = async (req, res) => {
  try {
    const { roles, user_id, contact_id } = req.user;
    if (hasRole(roles, 'Admin')) {
      const deals = await Deal.findAll();
      return res.json(deals);
    } else if (hasRole(roles, 'User')) {
      const deals = await Deal.findByOwner(user_id);
      return res.json(deals);
    } else if (hasRole(roles, 'Client')) {
      const deals = await Deal.findByContact(contact_id);
      return res.json(deals);
    } else {
      return res.status(403).json({ error: 'Forbidden: Requires Admin, User, or Client role.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /deals
export const createDeal = async (req, res) => {
  try {
    const { roles, user_id } = req.user;
    let { title, value, stage, owner_id, contact_id } = req.body;
    if (hasRole(roles, 'Admin')) {
      // Admin can set any owner_id
    } else if (hasRole(roles, 'User')) {
      owner_id = user_id; // User can only set themselves as owner
    } else {
      return res.status(403).json({ error: 'Forbidden: Requires Admin or User role.' });
    }
    const deal = await Deal.create({ title, value, stage, owner_id, contact_id });

    // --- INVOICE GENERATION ---
    const today = new Date();
    const invoice_number = `INV-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${deal.id}`;
    const issue_date = today.toISOString().slice(0, 10);
    const due_date = new Date(today.getTime() + 30*24*60*60*1000).toISOString().slice(0, 10); // +30 days
    const amount = value;
    const tax = Math.round(value * 0.1 * 100) / 100; // 10% tax
    const total = Math.round((Number(amount) + Number(tax)) * 100) / 100;
    let pdf_path = null;
    const invoice = await Invoice.create({ invoice_number, deal_id: deal.id, contact_id, issue_date, due_date, amount, tax, total, pdf_path });

    // --- PDF GENERATION ---
    const client = await UserDetails.findById(contact_id);
    pdf_path = generateInvoicePdf({ ...invoice, amount, tax, total }, client);
    await db.execute('UPDATE invoices SET pdf_path = ? WHERE id = ?', [pdf_path, invoice.id]);

    // --- NOTIFICATION ---
    await Notification.create({
      user_id: contact_id, // assuming contact_id is the user_id for clients
      type: 'invoice',
      title: 'New Invoice',
      message: `Your invoice for deal "${title}" is ready.`,
      pdf_path: pdf_path,
      invoice_number: invoice_number,
      label: `Invoice ${invoice_number}`,
      time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      unread: true
    });

    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /deals/:id
export const getDealById = async (req, res) => {
  try {
    const { roles, id, contact_id } = req.user;
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    if (hasRole(roles, 'Admin')) {
      return res.json(deal);
    } else if (hasRole(roles, 'User') && deal.owner_id === id) {
      return res.json(deal);
    } else if (hasRole(roles, 'Client') && deal.contact_id === contact_id) {
      return res.json(deal);
    } else {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this deal.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /deals/:id/stage
export const updateDealStage = async (req, res) => {
  try {
    const { roles, id } = req.user;
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    if (hasRole(roles, 'Admin') || (hasRole(roles, 'User') && deal.owner_id === id)) {
      const updated = await Deal.updateStage(req.params.id, req.body.stage);
      return res.json(updated);
    } else {
      return res.status(403).json({ error: 'Forbidden: Only Admin or the owner User can update deal stage.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /deals/:id
export const deleteDeal = async (req, res) => {
  try {
    const { roles, id } = req.user;
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    if (hasRole(roles, 'Admin') || (hasRole(roles, 'User') && deal.owner_id === id)) {
      await Deal.delete(req.params.id);
      return res.json({ message: 'Deal deleted successfully' });
    } else {
      return res.status(403).json({ error: 'Forbidden: Only Admin or the owner User can delete this deal.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /pipeline
export const getPipeline = async (req, res) => {
  try {
    const { roles, id } = req.user;
    if (hasRole(roles, 'Admin')) {
      const deals = await Deal.findAll();
      // Optionally, aggregate by stage for dashboard
      return res.json(deals);
    } else if (hasRole(roles, 'User')) {
      const deals = await Deal.findByOwner(id);
      return res.json(deals);
    } else {
      return res.status(403).json({ error: 'Forbidden: Requires Admin or User role.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 