import { jest } from '@jest/globals';
const dbMock = { query: jest.fn() };
jest.unstable_mockModule('../config/db.js', () => ({ default: dbMock }));
let Invoice;
beforeAll(async () => {
  ({ Invoice } = await import('../models/Invoice.js'));
});
describe('Invoice Model', () => {
  it('should create an invoice', () => {});
  it('should find all invoices', () => {});
  it('should find by id', () => {});
  it('should delete', () => {});
}); 