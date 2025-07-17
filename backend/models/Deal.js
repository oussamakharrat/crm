import db from '../config/db.js';

export class Deal {
  static async create({ title, value, stage, owner_id, contact_id }) {
    const [result] = await db.execute(
      'INSERT INTO deals (title, value, stage, owner_id, contact_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [
        title ?? null,
        value ?? null,
        stage ?? null,
        owner_id ?? null,
        contact_id ?? null
      ]
    );
    return { id: result.insertId, title, value, stage, owner_id, contact_id };
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM deals WHERE id = ?', [id ?? null]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM deals');
    return rows;
  }

  static async findByOwner(owner_id) {
    const [rows] = await db.execute('SELECT * FROM deals WHERE owner_id = ?', [owner_id ?? null]);
    return rows;
  }

  static async findByContact(contact_id) {
    const [rows] = await db.execute('SELECT * FROM deals WHERE contact_id = ?', [contact_id ?? null]);
    return rows;
  }

  static async updateStage(id, stage) {
    await db.execute('UPDATE deals SET stage = ?, updated_at = NOW() WHERE id = ?', [stage ?? null, id ?? null]);
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM deals WHERE id = ?', [id]);
  }
} 