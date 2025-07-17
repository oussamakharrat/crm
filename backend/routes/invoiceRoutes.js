import express from 'express';
import {
  getAllInvoices,
  createInvoice,
  getInvoiceById,
  deleteInvoice
} from '../controllers/invoiceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate); // Protect all invoice routes

// List all invoices
router.get('/invoices', getAllInvoices);
// Create an invoice
router.post('/invoices', createInvoice);
// Get invoice details
router.get('/invoices/:id', getInvoiceById);
// Delete an invoice
router.delete('/invoices/:id', deleteInvoice);

export default router; 