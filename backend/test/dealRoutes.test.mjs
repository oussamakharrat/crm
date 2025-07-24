import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import dealRoutes from '../routes/dealRoutes.js';
const app = express();
app.use(express.json());
app.use('/api/deals', dealRoutes);
describe('dealRoutes', () => {
  it('should handle GET /api/deals', () => {});
  // Add more route tests as needed
}); 