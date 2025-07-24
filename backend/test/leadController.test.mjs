import { jest } from '@jest/globals';
jest.unstable_mockModule('../models/Lead.js', () => ({ Lead: {} }));
import * as leadController from '../controllers/leadController.js';
describe('leadController', () => {
  it('should create lead', () => {});
  it('should get leads', () => {});
  it('should get lead by id', () => {});
  it('should update lead', () => {});
  it('should delete lead', () => {});
}); 