import { Settings } from '../models/Settings.js';
import path from 'path';

// GET /settings - get all app settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getAll();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /settings/logo - upload or update app logo (admin only)
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Only allow admin
    if (!req.user.roles || !req.user.roles.includes('Admin')) {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    const logoPath = `/uploads/app/${req.file.filename}`;
    await Settings.set('logo', logoPath);
    res.json({ success: true, logo: logoPath, message: 'Logo uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /settings/app-name - update app name (admin only)
export const updateAppName = async (req, res) => {
  try {
    if (!req.user.roles || !req.user.roles.includes('Admin')) {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    const { app_name } = req.body;
    if (!app_name || typeof app_name !== 'string' || !app_name.trim()) {
      return res.status(400).json({ error: 'App name is required' });
    }
    await Settings.set('app_name', app_name.trim());
    res.json({ success: true, app_name: app_name.trim(), message: 'App name updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 