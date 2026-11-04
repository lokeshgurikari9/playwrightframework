import { LoginRequestDto, RegisterRequestDto } from '../../models/request/auth.dto';
import { env } from '../../config/env.config';

export const buildValidCredentials = (overrides?: Partial<LoginRequestDto>): LoginRequestDto => ({
  email: env.TEST_USER_EMAIL,
  password: env.TEST_USER_PASSWORD,
  ...overrides,
});

export const buildRegistrationPayload = (overrides?: Partial<RegisterRequestDto>): RegisterRequestDto => ({
  email: env.TEST_USER_EMAIL,
  password: env.TEST_USER_PASSWORD,
  ...overrides,
});
