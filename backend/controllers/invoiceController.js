import { Invoice } from '../models/Invoice.js';

// GET /invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /invoices/:id
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /invoices
export const createInvoice = async (req, res) => {
  try {
    const { invoice_number, deal_id, contact_id, issue_date, due_date, amount, tax, total, pdf_path } = req.body;
    const invoice = await Invoice.create({ invoice_number, deal_id, contact_id, issue_date, due_date, amount, tax, total, pdf_path });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /invoices/:id
export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.delete(req.params.id);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 