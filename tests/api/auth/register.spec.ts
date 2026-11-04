import { test, expect } from '../../../fixtures/auth.fixture';
import { authErrorSchema, registerSuccessSchema } from '../../../schemas/auth.schema';
import { buildRegistrationPayload } from '../../../test-data/factories/auth.factory';
import { expectJsonSchema, expectStatus } from '../../../utils/helpers/responseAssertions';
import invalidPayloads from '../../../test-data/static/invalid-payloads.json';
import type { RegisterRequestDto } from '../../../models/request/auth.dto';

test.describe('Authentication API - /api/register', () => {
  test('@smoke POST /api/register - registers a defined user', async ({ authClient }) => {
    const response = await authClient.register(buildRegistrationPayload());

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, registerSuccessSchema, 'register response');

    expect(body.id).toBeGreaterThan(0);
    expect(body.token.length).toBeGreaterThan(0);
  });

  for (const testCase of invalidPayloads.register) {
    test(`@negative POST /api/register - rejects ${testCase.case}`, async ({ authClient }) => {
      const response = await authClient.register(testCase.payload as RegisterRequestDto);

      expectStatus(response, 400);
      const body = await expectJsonSchema(response, authErrorSchema, 'register error response');
      expect(body.error).toBe(testCase.expectedError);
    });
  }
});
