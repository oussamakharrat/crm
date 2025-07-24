import { jest } from '@jest/globals';

describe('Sanity', () => {
  it('should run a test', () => {
    expect(true).toBe(true);
  });
});

describe('Contact Model', () => {
  let Contact;
  let dbMock;

  beforeEach(async () => {
    dbMock = { query: jest.fn() };
    jest.unstable_mockModule('../config/db.js', () => ({ default: dbMock }));
    ({ Contact } = await import('../models/Contact.js'));
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should create a contact', async () => {
    dbMock.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const data = { name: 'Test', email: 'test@example.com', phone: '123', address: 'Somewhere' };
    const result = await Contact.create(data);
    expect(result).toEqual({ id: 1, ...data });
  });

  it('should find all contacts', async () => {
    dbMock.query.mockResolvedValueOnce([[{ id: 1, name: 'Test' }]]);
    const result = await Contact.findAll();
    expect(result).toEqual([{ id: 1, name: 'Test' }]);
  });

  it('should find a contact by id', async () => {
    dbMock.query.mockResolvedValueOnce([[{ id: 1, name: 'Test' }]]);
    const result = await Contact.findById(1);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });
}); 