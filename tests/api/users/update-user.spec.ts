import { test, expect } from '../../../fixtures/api.fixture';
import { buildPatchUserPayload, buildUpdateUserPayload } from '../../../test-data/factories/user.factory';
import { updatedUserSchema } from '../../../schemas/user.schema';
import { expectJsonSchema, expectStatus } from '../../../utils/helpers/responseAssertions';

test.describe('Users API - update', () => {
  test('@smoke PUT /api/users/2 - replaces user details', async ({ userClient }) => {
    const payload = buildUpdateUserPayload();
    const response = await userClient.updateUser(2, payload);

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, updatedUserSchema, 'update user response');

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
  });

  test('@regression PATCH /api/users/2 - updates a single field', async ({ userClient }) => {
    const payload = buildPatchUserPayload();
    const response = await userClient.patchUser(2, payload);

    expectStatus(response, 200);
    const body = await response.json();

    expect(body.job).toBe(payload.job);
    expect(body).toHaveProperty('updatedAt');
    expect(Number.isNaN(Date.parse(body.updatedAt))).toBe(false);
  });
});
