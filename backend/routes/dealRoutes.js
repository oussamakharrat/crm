import express from 'express';
import {
  getAllDeals,
  createDeal,
  getDealById,
  updateDealStage,
  getPipeline,
  deleteDeal
} from '../controllers/dealController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate); // Protect all deal routes

// List all deals
router.get('/deals', getAllDeals);
// Create a deal
router.post('/deals', createDeal);
// Get deal details
router.get('/deals/:id', getDealById);
// Update deal stage
router.patch('/deals/:id/stage', updateDealStage);
// Visual sales pipeline dashboard
router.get('/pipeline', getPipeline);
// Delete a deal
router.delete('/deals/:id', deleteDeal);

export default router; 