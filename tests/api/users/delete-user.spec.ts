import { test, expect } from '../../../fixtures/api.fixture';
import { expectStatus } from '../../../utils/helpers/responseAssertions';

test.describe('Users API - delete', () => {
  test('@smoke DELETE /api/users/2 - returns 204 and no body', async ({ userClient }) => {
    const response = await userClient.deleteUser(2);

    expectStatus(response, 204);
    expect(await response.text()).toBe('');
  });
});
