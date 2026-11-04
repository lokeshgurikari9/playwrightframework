import { test, expect } from '../../../fixtures/auth.fixture';
import { LoginSuccessResponse, LoginErrorResponse } from '../../../models/response/auth.types';

test.describe('Authentication API - /api/login', () => {
  const validCredentials = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
  };

  test('POST /api/login - should authenticate successfully with valid credentials (200 OK)', async ({ authClient }) => {
    const response = await authClient.login(validCredentials);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body: LoginSuccessResponse = await response.json();
    
    // Assert response schema and integrity
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /api/login - should fail when password is missing (400 Bad Request)', async ({ authClient }) => {
    const response = await authClient.login({
      email: 'peter@klaven',
    });

    expect(response.status()).toBe(400);

    const body: LoginErrorResponse = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Missing password');
  });

  test('POST /api/login - should fail when email is unregistered (400 Bad Request)', async ({ authClient }) => {
    const response = await authClient.login({
      email: 'unregistered.user@invalid-domain.com',
      password: 'SomePassword123!',
    });

    expect(response.status()).toBe(400);

    const body: LoginErrorResponse = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('user not found');
  });

  test('POST /api/login - should fail with an empty payload (400 Bad Request)', async ({ authClient }) => {
    const response = await authClient.login({ email: '' });

    expect(response.status()).toBe(400);

    const body: LoginErrorResponse = await response.json();
    expect(body.error).toBeDefined();
  });

  test('Auth Fixture check - should auto-inject valid token via test fixture', async ({ authToken }) => {
    expect(authToken).toBeDefined();
    expect(typeof authToken).toBe('string');
    expect(authToken.length).toBeGreaterThan(0);
  });
});