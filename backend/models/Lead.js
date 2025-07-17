import db from '../config/db.js';

// Create a new lead
export async function createLead(data) {
  const [result] = await db.execute(
    `INSERT INTO leads (name, email, phone, company, status, source, assigned_to, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.name, data.email, data.phone, data.company, data.status, data.source, data.assigned_to, data.notes]
  );
  return { id: result.insertId, ...data };
}

// Get all leads (admin sees all, others see only their assigned leads)
export async function getAllLeads(user) {
  // user.roles is an array of role objects or strings
  const isAdmin = user.roles && (Array.isArray(user.roles)
    ? user.roles.some(r => ((r.name || r).toLowerCase && (r.name || r).toLowerCase() === 'admin'))
    : (user.roles.toLowerCase && user.roles.toLowerCase() === 'admin'));
  if (isAdmin) {
    const [rows] = await db.execute('SELECT * FROM leads');
    return rows;
  } else {
    const [rows] = await db.execute('SELECT * FROM leads WHERE assigned_to = ?', [user.user_id]);
    return rows;
  }
}

// Get a lead by ID
export async function getLeadById(id) {
  const [rows] = await db.execute('SELECT * FROM leads WHERE id = ?', [id]);
  return rows[0];
}

// Update a lead
export async function updateLead(id, data) {
  await db.execute(
    `UPDATE leads SET name=?, email=?, phone=?, company=?, status=?, source=?, assigned_to=?, notes=? WHERE id=?`,
    [data.name, data.email, data.phone, data.company, data.status, data.source, data.assigned_to, data.notes, id]
  );
  return getLeadById(id);
}

// Delete a lead
export async function deleteLead(id) {
  await db.execute('DELETE FROM leads WHERE id = ?', [id]);
  return { message: 'Lead deleted' };
} 