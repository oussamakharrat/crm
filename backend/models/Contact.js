import db from '../config/db.js';

export class Contact {
  static async create({ name, email, phone, address }) {
    const [result] = await db.query(
      'INSERT INTO contacts (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    return { id: result.insertId, name, email, phone, address };
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY id DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async update(id, { name, email, phone, address }) {
    await db.query(
      'UPDATE contacts SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone, address, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM contacts WHERE id = ?', [id]);
    return { id };
  }
} 