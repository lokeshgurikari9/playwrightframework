import { APIRequestContext } from '@playwright/test';
import { test as authTest } from './auth.fixture';
import { UserClient } from '../clients/UserClient';
import { ResourceClient } from '../clients/ResourceClient';

type ApiFixtures = {
  userClient: UserClient;
  resourceClient: ResourceClient;
  /**
   * Alias retained for callers that only need a token-bearing context.
   * Prefer `authenticatedApiContext` in new tests.
   */
  authenticatedRequest: APIRequestContext;
};

/**
 * Unified fixture surface for API tests. Extending the auth fixture means a
 * single import gives every spec access to auth, user and resource clients.
 */
export const test = authTest.extend<ApiFixtures>({
  userClient: async ({ request }, use) => {
    await use(new UserClient(request));
  },

  resourceClient: async ({ request }, use) => {
    await use(new ResourceClient(request));
  },

  authenticatedRequest: async ({ authenticatedApiContext }, use) => {
    await use(authenticatedApiContext);
  },
});

export { expect } from './auth.fixture';
export type { ApiFixtures };
