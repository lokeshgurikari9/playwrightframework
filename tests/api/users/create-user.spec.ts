import { test, expect } from '../../../fixtures/api.fixture';
import { buildCreateUserPayload } from '../../../test-data/factories/user.factory';
import { UserResponse } from '../../../models/response/user.types';

test.describe('Users API Endpoints', () => {
  test('should create a new user successfully (201 Created)', async ({ userClient }) => {
    const payload = buildCreateUserPayload({ name: 'Alex QA', job: 'SDET' });
    const response = await userClient.createUser(payload);

    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();

    const data: UserResponse = await response.json();
    expect(data.name).toBe(payload.name);
    expect(data.job).toBe(payload.job);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');
  });

  test('should retrieve an existing user (200 OK)', async ({ userClient }) => {
    const response = await userClient.getUserById(2);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(2);
    expect(body.data.email).toBeDefined();
  });
});
