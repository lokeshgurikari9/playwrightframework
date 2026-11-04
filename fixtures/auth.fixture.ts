import { test as base, APIRequestContext } from '@playwright/test';
import { AuthClient } from '../clients/AuthClient';
import { env, buildAuthHeaders, buildDefaultHeaders } from '../config/env.config';

type AuthFixtures = {
  authClient: AuthClient;
  authToken: string;
  authenticatedApiContext: APIRequestContext;
};

export const test = base.extend<AuthFixtures>({
  // Direct client instance for auth tests
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  // Generates and provisions a valid bearer token dynamically
  authToken: async ({ request }, use) => {
    const authClient = new AuthClient(request);
    const { token } = await authClient.loginAndGetToken({
      email: env.TEST_USER_EMAIL,
      password: env.TEST_USER_PASSWORD,
    });

    await use(token);
  },

  // Pre-configured API context bearing the generated token in headers
  authenticatedApiContext: async ({ playwright, authToken }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.BASE_URL,
      extraHTTPHeaders: {
        ...buildDefaultHeaders(),
        ...buildAuthHeaders(authToken),
      },
      timeout: env.REQUEST_TIMEOUT_MS,
    });

    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';
export type { AuthFixtures };
