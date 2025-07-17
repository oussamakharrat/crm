import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
// import { authorize } from '../middleware/authMiddleware.js'; // Uncomment if/when you add authorization
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
} from '../controllers/leadController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);
// router.use(authorize); // Uncomment and configure as needed

router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router; 