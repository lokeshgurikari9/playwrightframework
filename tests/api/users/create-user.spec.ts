import { test, expect } from '../../../fixtures/api.fixture';
import { buildCreateUserPayload } from '../../../test-data/factories/user.factory';
import { createdUserSchema } from '../../../schemas/user.schema';
import {
  expectDurationBelow,
  expectJsonSchema,
  expectStatus,
  measureDuration,
} from '../../../utils/helpers/responseAssertions';

test.describe('Users API - create', () => {
  test('@smoke POST /api/users - creates a user', async ({ userClient }) => {
    const payload = buildCreateUserPayload();
    const { result: response, durationMs } = await measureDuration(() =>
      userClient.createUser(payload),
    );

    expectDurationBelow(durationMs, 5_000, 'create user request');
    expectStatus(response, 201);
    const body = await expectJsonSchema(response, createdUserSchema, 'create user response');

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
  });
});
