import db from '../config/db.js';

export class Invoice {
  static async create({ invoice_number, deal_id, contact_id, issue_date, due_date, amount, tax, total, pdf_path }) {
    const [result] = await db.execute(
      'INSERT INTO invoices (invoice_number, deal_id, contact_id, issue_date, due_date, amount, tax, total, pdf_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [invoice_number, deal_id, contact_id, issue_date, due_date, amount, tax, total, pdf_path]
    );
    return { id: result.insertId, invoice_number, deal_id, contact_id, issue_date, due_date, amount, tax, total, pdf_path };
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM invoices');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM invoices WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async delete(id) {
    await db.execute('DELETE FROM invoices WHERE id = ?', [id]);
    return { id };
  }
} 