import { jest } from '@jest/globals';
jest.unstable_mockModule('../models/Report.js', () => ({ Report: {} }));
import * as reportController from '../controllers/reportController.js';
describe('reportController', () => {
  it('should get users by role', () => {});
  it('should get leads by status', () => {});
  it('should get deals by stage', () => {});
  it('should get contacts by company', () => {});
  it('should get all reports', () => {});
  it('should create report', () => {});
  it('should update report', () => {});
  it('should delete report', () => {});
  it('should get total revenue', () => {});
  it('should get revenue by month', () => {});
  it('should get top performers', () => {});
  it('should get highest deal', () => {});
  it('should get report by id', () => {});
}); 