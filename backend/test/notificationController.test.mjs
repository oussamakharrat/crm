import { jest } from '@jest/globals';
jest.unstable_mockModule('../models/Notification.js', () => ({ Notification: {} }));
import * as notificationController from '../controllers/notificationController.js';
describe('notificationController', () => {
  it('should get all notifications', () => {});
  it('should mark as read', () => {});
  it('should delete notification', () => {});
}); 