import { jest } from '@jest/globals';
const dbMock = { query: jest.fn() };
jest.unstable_mockModule('../config/db.js', () => ({ default: dbMock }));
let Settings;
beforeAll(async () => {
  ({ Settings } = await import('../models/Settings.js'));
});
describe('Settings Model', () => {
  it('should get all settings', () => {});
  it('should update app name', () => {});
  it('should update logo', () => {});
}); 