import { test as base, APIRequestContext } from '@playwright/test';
import { UserClient } from '../clients/UserClient';
import { env } from '../config/env.config';

type ApiFixtures = {
  authenticatedRequest: APIRequestContext;
  userClient: UserClient;
};

export const test = base.extend<ApiFixtures>({
  authenticatedRequest: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.BASE_URL,
      extraHTTPHeaders: {
        'Authorization': `Bearer ${env.AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    await use(context);
    await context.dispose();
  },

  userClient: async ({ request }, use) => {
    await use(new UserClient(request));
  },
});

export { expect } from '@playwright/test';
