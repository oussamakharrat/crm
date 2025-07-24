import { jest } from '@jest/globals';
const dbMock = { query: jest.fn() };
jest.unstable_mockModule('../config/db.js', () => ({ default: dbMock }));
let Notification;
beforeAll(async () => {
  ({ Notification } = await import('../models/Notification.js'));
});
describe('Notification Model', () => {
  it('should create a notification', () => {});
  it('should find all notifications', () => {});
  it('should find by id', () => {});
  it('should mark as read', () => {});
  it('should delete', () => {});
}); 