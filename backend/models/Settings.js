import db from '../config/db.js';

export class Settings {
  static async get(key) {
    const [rows] = await db.execute('SELECT * FROM settings WHERE `key` = ?', [key]);
    return rows[0] || null;
  }

  static async set(key, value) {
    // Upsert logic: insert or update
    await db.execute('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)', [key, value]);
    return this.get(key);
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM settings');
    return rows;
  }
} 