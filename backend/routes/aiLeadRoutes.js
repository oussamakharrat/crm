import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  generateLeadsFromText,
  generateLeadsFromWebsite,
  generateLeadsFromIndustry,
  previewGeneratedLeads
} from '../controllers/aiLeadController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Generate leads from text
router.post('/generate-from-text', generateLeadsFromText);

// Generate leads from website URL
router.post('/generate-from-website', generateLeadsFromWebsite);

// Generate leads from industry and location
router.post('/generate-from-industry', generateLeadsFromIndustry);

// Preview generated leads without saving
router.post('/preview', previewGeneratedLeads);

export default router; 