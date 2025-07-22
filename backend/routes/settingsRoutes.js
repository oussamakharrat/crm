import express from 'express';
import { getSettings, uploadLogo, updateAppName } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadAppLogo } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// GET /settings - get all app settings
router.get('/', getSettings);

// POST /settings/logo - upload/update logo (admin only)
router.post('/logo', authenticate, uploadAppLogo.single('logo'), uploadLogo);

// POST /settings/app-name - update app name (admin only)
router.post('/app-name', authenticate, updateAppName);

export default router; 