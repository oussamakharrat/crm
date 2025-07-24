import { jest } from '@jest/globals';
jest.unstable_mockModule('../models/Settings.js', () => ({ Settings: {} }));
import * as settingsController from '../controllers/settingsController.js';
describe('settingsController', () => {
  it('should get settings', () => {});
  it('should upload logo', () => {});
  it('should update app name', () => {});
}); 