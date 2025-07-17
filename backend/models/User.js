// models/User.js
import db from '../config/db.js'
import bcrypt from 'bcryptjs';

export class UserDetails {
  static async create({ name, phone, address, avatar }) {
    const [result] = await db.execute(
      'INSERT INTO userdetails (name, phone, address, avatar) VALUES (?, ?, ?, ?)',
      [
        name ?? null,
        phone ?? null,
        address ?? null,
        avatar ?? null
      ]
    );
    return { id: result.insertId, name, phone, address, avatar };
  }
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM userdetails WHERE id = ?', [id]);
    return rows[0];
  }
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM userdetails');
    return rows;
  }
  static async update(id, { name, phone, address, avatar }) {
    await db.execute(
      'UPDATE userdetails SET name = ?, phone = ?, address = ?, avatar = ? WHERE id = ?',
      [
        name ?? null,
        phone ?? null,
        address ?? null,
        avatar ?? null,
        id ?? null
      ]
    );
    return this.findById(id);
  }
  static async delete(id) {
    await db.execute('DELETE FROM userdetails WHERE id = ?', [id]);
    return { id };
  }

  static async findLastInserted() {
    const [rows] = await db.query('SELECT * FROM userdetails ORDER BY id DESC LIMIT 1');
    return rows[0] || null;
  }
}

export class UserAuth {
  static async create({ user_id, email, password, token = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO userauth (user_id, email, password, token) VALUES (?, ?, ?, ?)',
      [
        user_id ?? null,
        email ?? null,
        hashedPassword ?? null,
        token ?? null
      ]
    );
    return { id: result.insertId, user_id, email, token };
  }
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM userauth WHERE email = ?', [email]);
    return rows[0];
  }
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM userauth WHERE id = ?', [id]);
    return rows[0];
  }
  static async updateToken(id, token) {
    await db.execute('UPDATE userauth SET token = ? WHERE id = ?', [token ?? null, id ?? null]);
    return this.findById(id);
  }
  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return false;
    const match = await bcrypt.compare(password, user.password);
    return match ? user : false;
  }
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM userauth');
    return rows;
  }
}

export class Role {
  static async create({ name }) {
    const [result] = await db.execute('INSERT INTO role (name) VALUES (?)', [name ?? null]);
    return { id: result.insertId, name };
  }
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM role WHERE id = ?', [id]);
    return rows[0];
  }
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM role');
    return rows;
  }
}

export class RoleUser {
  static async create({ user_id, role_id }) {
    const [result] = await db.execute('INSERT INTO roleuser (user_id, role_id) VALUES (?, ?)', [user_id ?? null, role_id ?? null]);
    return { id: result.insertId, user_id, role_id };
  }
  static async findByUserId(user_id) {
    const [rows] = await db.execute(
      `SELECT ru.role_id, r.name FROM roleuser ru JOIN role r ON ru.role_id = r.id WHERE ru.user_id = ?`,
      [user_id]
    );
    return rows;
  }
  static async findByRoleId(role_id) {
    const [rows] = await db.execute('SELECT * FROM roleuser WHERE role_id = ?', [role_id]);
    return rows;
  }
  static async deleteByUserId(user_id) {
    await db.execute('DELETE FROM roleuser WHERE user_id = ?', [user_id]);
  }
}

export class Permissions {
  static async create({ name }) {
    const [result] = await db.execute('INSERT INTO permissions (name) VALUES (?)', [name ?? null]);
    return { id: result.insertId, name };
  }
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM permissions WHERE id = ?', [id]);
    return rows[0];
  }
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM permissions');
    return rows;
  }
}

export class RolePermissions {
  static async create({ role_id, permission_id }) {
    const [result] = await db.execute('INSERT INTO rolepermissions (role_id, permission_id) VALUES (?, ?)', [role_id ?? null, permission_id ?? null]);
    return { id: result.insertId, role_id, permission_id };
  }
  static async findByRoleId(role_id) {
    const [rows] = await db.execute('SELECT * FROM rolepermissions WHERE role_id = ?', [role_id]);
    return rows;
  }
  static async findByPermissionId(permission_id) {
    const [rows] = await db.execute('SELECT * FROM rolepermissions WHERE permission_id = ?', [permission_id]);
    return rows;
  }
}

export class User {
  static async findAllClients() {
    const [rows] = await db.execute(`
      SELECT u.id, u.name, u.phone, u.address, u.avatar, a.email
      FROM userdetails u
      JOIN roleuser ru ON u.id = ru.user_id
      JOIN role r ON ru.role_id = r.id
      JOIN userauth a ON u.id = a.user_id
      WHERE LOWER(r.name) = 'client'
    `);
    return rows;
  }
}
