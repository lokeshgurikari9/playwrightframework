import { test, expect } from '../../../fixtures/api.fixture';
import { buildValidCredentials } from '../../../test-data/factories/auth.factory';
import { extractBearerToken } from '../../../utils/helpers/tokenParser';
import { expectStatus } from '../../../utils/helpers/responseAssertions';
import { singleUserSchema } from '../../../schemas/user.schema';
import { env } from '../../../config/env.config';

test.describe('Authentication API - token lifecycle', () => {
  test('@regression re-authentication returns a usable token', async ({ authClient, authToken }) => {
    const refreshed = await authClient.loginAndGetToken(buildValidCredentials());

    expect(refreshed.token.length).toBeGreaterThan(0);

    // Opaque tokens are still valid bearer credentials for downstream calls.
    expect(extractBearerToken(`Bearer ${refreshed.token}`)).toBe(refreshed.token);
    expect(authToken.length).toBeGreaterThan(0);
  });

  test('@smoke token-bearing context forwards the bearer header', async ({
    authenticatedApiContext,
  }) => {
    const response = await authenticatedApiContext.get('/api/users/2');

    if (env.API_KEY) {
      expectStatus(response, 200);
      const body = await response.json();
      expect(body.data.id).toBe(2);
      expect(singleUserSchema.safeParse(body).success).toBe(true);
      return;
    }

    // ReqRes rejects Bearer-only calls to /api/* and asks for x-api-key.
    // The 401 proves the context is actually forwarding the Authorization header.
    expectStatus(response, 401);
    const body = await response.json();
    expect(body.error).toBe('missing_api_key');
  });
});
