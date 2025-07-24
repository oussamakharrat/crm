import { jest } from '@jest/globals';
const dbMock = { query: jest.fn() };
jest.unstable_mockModule('../config/db.js', () => ({ default: dbMock }));
let Lead;
beforeAll(async () => {
  ({ Lead } = await import('../models/Lead.js'));
});
describe('Lead Model', () => {
  it('should create a lead', () => {});
  it('should get all leads', () => {});
  it('should get lead by id', () => {});
  it('should update lead', () => {});
  it('should delete lead', () => {});
}); 