import { jest } from '@jest/globals';
jest.unstable_mockModule('../models/Invoice.js', () => ({ Invoice: {} }));
import * as invoiceController from '../controllers/invoiceController.js';
describe('invoiceController', () => {
  it('should get all invoices', () => {});
  it('should create invoice', () => {});
  it('should get invoice by id', () => {});
  it('should delete invoice', () => {});
}); 