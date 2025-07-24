import { jest } from '@jest/globals';
jest.unstable_mockModule('../models/Contact.js', () => ({ Contact: {} }));
import * as contactController from '../controllers/contactController.js';
describe('contactController', () => {
  it('should create contact', () => {});
  it('should get all contacts', () => {});
  it('should get contact by id', () => {});
  it('should update contact', () => {});
  it('should delete contact', () => {});
}); 