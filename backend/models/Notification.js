// Recommended SQL for notifications table:
// CREATE TABLE notifications (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id INT NOT NULL,
//   type VARCHAR(50) NOT NULL,
//   title VARCHAR(255),
//   message TEXT,
//   pdf_path VARCHAR(255),
//   invoice_number VARCHAR(50),
//   label VARCHAR(255),
//   time DATETIME NOT NULL,
//   unread BOOLEAN DEFAULT TRUE,
//   FOREIGN KEY (user_id) REFERENCES userdetails(id)
// );
import db from '../config/db.js';

export class Notification {
  static async create({ user_id, type, title, message, pdf_path, invoice_number, label, time, unread = true }) {
    const [result] = await db.execute(
      'INSERT INTO notifications (user_id, type, title, message, pdf_path, invoice_number, label, time, unread) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, type, title, message, pdf_path, invoice_number, label, time, unread ? 1 : 0]
    );
    return { id: result.insertId, user_id, type, title, message, pdf_path, invoice_number, label, time, unread };
  }

  static async findByUserId(user_id) {
    const [rows] = await db.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY time DESC', [user_id]);
    return rows;
  }

  static async markAllAsRead(user_id) {
    await db.execute('UPDATE notifications SET unread = 0 WHERE user_id = ?', [user_id]);
  }
} 