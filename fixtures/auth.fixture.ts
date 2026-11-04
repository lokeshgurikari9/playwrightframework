import { test as base, APIRequestContext } from '@playwright/test';
import { AuthClient } from '../clients/AuthClient';
import { LoginSuccessResponse } from '../models/response/auth.types';
import { env } from '../config/env.config';

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
    const response = await authClient.login({
      email: process.env.TEST_USER_EMAIL || 'eve.holt@reqres.in',
      password: process.env.TEST_USER_PASSWORD || 'cityslicka',
    });

    const data: LoginSuccessResponse = await response.json();
    await use(data.token);
  },

  // Pre-configured API context bearing the generated token in headers
  authenticatedApiContext: async ({ playwright, authToken }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.BASE_URL,
      extraHTTPHeaders: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';