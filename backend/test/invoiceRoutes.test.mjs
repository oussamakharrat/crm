import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import invoiceRoutes from '../routes/invoiceRoutes.js';
const app = express();
app.use(express.json());
app.use('/api/invoices', invoiceRoutes);
describe('invoiceRoutes', () => {
  it('should handle GET /api/invoices', () => {});
  // Add more route tests as needed
}); 