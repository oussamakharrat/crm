import { jest } from '@jest/globals';
const dbMock = { query: jest.fn() };
jest.unstable_mockModule('../config/db.js', () => ({ default: dbMock }));
let Deal;
beforeAll(async () => {
  ({ Deal } = await import('../models/Deal.js'));
});
describe('Deal Model', () => {
  it('should create a deal', () => {});
  it('should find all deals', () => {});
  it('should find by id', () => {});
  it('should find by owner', () => {});
  it('should find by contact', () => {});
  it('should update stage', () => {});
  it('should delete', () => {});
}); 