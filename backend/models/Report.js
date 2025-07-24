import pool from '../config/db.js';

export class Report {
  static async usersByRole() {
    const [rows] = await pool.query(`
      SELECT r.name AS role, COUNT(ru.user_id) AS user_count,
        GROUP_CONCAT(DISTINCT ud.name ORDER BY ud.name SEPARATOR ',') AS user_names,
        GROUP_CONCAT(DISTINCT ua.email ORDER BY ua.email SEPARATOR ',') AS user_emails
      FROM role r
      LEFT JOIN roleuser ru ON r.id = ru.role_id
      LEFT JOIN userdetails ud ON ru.user_id = ud.id
      LEFT JOIN userauth ua ON ru.user_id = ua.user_id
      GROUP BY r.id
    `);
    // Format users as array of { name, email }
    return rows.map(row => ({
      role: row.role,
      user_count: row.user_count,
      users: row.user_names ? row.user_names.split(',').map((name, i) => ({ name, email: row.user_emails ? row.user_emails.split(',')[i] : '' })) : []
    }));
  }

  static async leadsByStatus() {
    const [rows] = await pool.query(`
      SELECT status, COUNT(*) AS lead_count
      FROM leads
      GROUP BY status
    `);
    return rows;
  }

  static async dealsByStage() {
    const [rows] = await pool.query(`
      SELECT stage, COUNT(*) AS deal_count
      FROM deals
      GROUP BY stage
    `);
    return rows;
  }

  static async contactsByCompany() {
    const [rows] = await pool.query(`
      SELECT company, COUNT(*) AS contact_count
      FROM contacts
      GROUP BY company
    `);
    return rows;
  }

  static async allReports() {
    const [rows] = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
    return rows;
  }

  static async createReport({ name, description, type, parameters, created_by }) {
    const [result] = await pool.query(
      'INSERT INTO reports (name, description, type, parameters, created_by) VALUES (?, ?, ?, ?, ?)',
      [name, description, type, JSON.stringify(parameters), created_by]
    );
    return { id: result.insertId, name, description, type, parameters, created_by };
  }

  static async updateReport(id, { name, description, type, parameters }) {
    await pool.query(
      'UPDATE reports SET name = ?, description = ?, type = ?, parameters = ? WHERE id = ?',
      [name, description, type, JSON.stringify(parameters), id]
    );
    return this.getReportById(id);
  }

  static async deleteReport(id) {
    await pool.query('DELETE FROM reports WHERE id = ?', [id]);
    return { id };
  }

  static async getReportById(id) {
    const [rows] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async totalRevenue() {
    const [rows] = await pool.query(`SELECT SUM(value) AS total_revenue FROM deals`);
    return rows[0];
  }

  static async revenueByMonth() {
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, MAX(value) AS revenue
      FROM deals
      GROUP BY month
      ORDER BY month
    `);
    return rows;
  }

  static async topPerformers() {
    const [rows] = await pool.query(`
      SELECT u.name, u.avatar, SUM(d.value) AS total_revenue
      FROM deals d
      JOIN userdetails u ON d.owner_id = u.id
      GROUP BY d.owner_id
      ORDER BY total_revenue DESC
      LIMIT 5
    `);
    return rows;
  }

  static async highestDeal() {
    const [rows] = await pool.query(`
      SELECT value, DATE_FORMAT(created_at, '%M %Y') as month
      FROM deals
      ORDER BY value DESC
      LIMIT 1
    `);
    return rows[0] || { value: 0, month: null };
  }
} 