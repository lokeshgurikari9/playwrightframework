import { test, expect } from '../../../fixtures/api.fixture';
import { singleUserSchema, userListSchema } from '../../../schemas/user.schema';
import { expectJsonSchema, expectStatus } from '../../../utils/helpers/responseAssertions';

test.describe('Users API - read', () => {
  test('@smoke GET /api/users/2 - returns a single user', async ({ userClient }) => {
    const response = await userClient.getUserById(2);

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, singleUserSchema, 'single user response');

    expect(body.data.id).toBe(2);
    expect(body.data.email.length).toBeGreaterThan(0);
  });

  test('@negative GET /api/users/23 - returns 404 for an unknown user', async ({ userClient }) => {
    const response = await userClient.getUserById(23);

    expectStatus(response, 404);
    expect(await response.json()).toEqual({});
  });

  test('@smoke GET /api/users?page=1 - returns the first page', async ({ userClient }) => {
    const response = await userClient.listUsers({ page: 1 });

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, userListSchema, 'user list response');

    expect(body.page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(body.per_page);
    expect(body.total_pages).toBeGreaterThan(0);
  });

  test('@regression GET /api/users?per_page=3 - honours the page size', async ({ userClient }) => {
    const response = await userClient.listUsers({ page: 1, per_page: 3 });

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, userListSchema, 'paginated user list response');

    expect(body.per_page).toBe(3);
    expect(body.data).toHaveLength(3);
    expect(body.total_pages).toBe(Math.ceil(body.total / body.per_page));
  });
});
