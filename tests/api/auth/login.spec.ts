import { test, expect } from '../../../fixtures/auth.fixture';
import { authErrorSchema, loginSuccessSchema } from '../../../schemas/auth.schema';
import { buildValidCredentials } from '../../../test-data/factories/auth.factory';
import { expectJsonSchema, expectStatus } from '../../../utils/helpers/responseAssertions';
import invalidPayloads from '../../../test-data/static/invalid-payloads.json';
import type { LoginRequestDto } from '../../../models/request/auth.dto';

test.describe('Authentication API - /api/login', () => {
  test('@smoke POST /api/login - authenticates with valid credentials', async ({ authClient }) => {
    const response = await authClient.login(buildValidCredentials());

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, loginSuccessSchema, 'login response');

    expect(body.token.length).toBeGreaterThan(0);
  });

  for (const testCase of invalidPayloads.login) {
    test(`@negative POST /api/login - rejects ${testCase.case}`, async ({ authClient }) => {
      const response = await authClient.login(testCase.payload as LoginRequestDto);

      expectStatus(response, 400);
      const body = await expectJsonSchema(response, authErrorSchema, 'login error response');
      expect(body.error).toBe(testCase.expectedError);
    });
  }

  test('@smoke auth fixture provisions a usable token automatically', async ({ authToken }) => {
    expect(authToken).toBeDefined();
    expect(typeof authToken).toBe('string');
    expect(authToken.length).toBeGreaterThan(0);
  });
});
