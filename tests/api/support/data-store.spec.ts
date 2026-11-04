import { test, expect } from '../../../fixtures/db.fixture';
import { defaultSeedUsers, seedUsers } from '../../../utils/db/seeders';

test.describe('In-memory data store', () => {
  test('@regression seeds, finds and clears isolated records', ({ dbClient }) => {
    seedUsers(dbClient);

    expect(dbClient.count('users')).toBe(defaultSeedUsers.length);
    expect(dbClient.get('users', 2)).toMatchObject({ email: 'janet.weaver@reqres.in' });
    expect(dbClient.find('users', (user) => user.id === 1)).toHaveLength(1);

    expect(dbClient.delete('users', 1)).toBe(true);
    expect(dbClient.count('users')).toBe(defaultSeedUsers.length - 1);

    dbClient.clear();
    expect(dbClient.count('users')).toBe(0);
  });
});
