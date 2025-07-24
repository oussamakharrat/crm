import { jest } from '@jest/globals';
jest.unstable_mockModule('../models/Deal.js', () => ({ Deal: {} }));
jest.unstable_mockModule('../models/Invoice.js', () => ({ Invoice: {} }));
jest.unstable_mockModule('../models/Notification.js', () => ({ Notification: {} }));
jest.unstable_mockModule('../models/User.js', () => ({ UserDetails: {} }));
jest.unstable_mockModule('../utils/invoicePdf.js', () => ({ generateInvoicePdf: jest.fn() }));
import * as dealController from '../controllers/dealController.js';
describe('dealController', () => {
  it('should get all deals', () => {});
  it('should create a deal', () => {});
  it('should get deal by id', () => {});
  it('should update deal stage', () => {});
  it('should get pipeline', () => {});
  it('should delete deal', () => {});
}); 