import { fakeClients } from '../app/lib/fakeData';

describe('fakeClients', () => {
  it('should be an array of clients', () => {
    expect(Array.isArray(fakeClients)).toBe(true);
    expect(fakeClients.length).toBeGreaterThan(0);
  });

  it('should have clients with id, name, and hourlyRate', () => {
    fakeClients.forEach((client) => {
      expect(client).toHaveProperty('id');
      expect(client).toHaveProperty('name');
      expect(client).toHaveProperty('hourlyRate');
    });
  });
});
