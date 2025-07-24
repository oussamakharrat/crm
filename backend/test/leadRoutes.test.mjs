import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import leadRoutes from '../routes/leadRoutes.js';
const app = express();
app.use(express.json());
app.use('/api/leads', leadRoutes);
describe('leadRoutes', () => {
  it('should handle GET /api/leads', () => {});
  // Add more route tests as needed
}); 