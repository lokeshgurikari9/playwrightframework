import { test as base } from '@playwright/test';
import { InMemoryDbClient } from '../utils/db/dbClient';

type DbFixtures = {
  dbClient: InMemoryDbClient;
};

/**
 * Provides an isolated in-memory store per test and resets it afterwards.
 * Useful for seeding expected values or caching IDs created during a spec.
 */
export const test = base.extend<DbFixtures>({
  dbClient: async ({}, use) => {
    const dbClient = new InMemoryDbClient();
    await use(dbClient);
    dbClient.clear();
  },
});

export { expect } from '@playwright/test';
export type { DbFixtures };
