import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'silent'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Treats empty values and the placeholders shipped in `.env.example` as absent.
 * This prevents an unconfigured API key or token from being sent to the API.
 */
const optional = (value: string | undefined): string => {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  if (/^(your_|changeme|<)/i.test(trimmed)) return '';
  return trimmed;
};

const required = (value: string | undefined, fallback: string): string => optional(value) || fallback;

const positiveNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(optional(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const nonNegativeNumber = (value: string | undefined, fallback: number): number => {
  const normalized = optional(value);
  if (normalized === '') return fallback;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const logLevel = (value: string | undefined): LogLevel => {
  const candidate = optional(value).toLowerCase() as LogLevel;
  return LOG_LEVELS.includes(candidate) ? candidate : 'warn';
};

const apiKey = optional(process.env.API_KEY);

export const env = {
  BASE_URL: required(process.env.BASE_URL, 'https://reqres.in').replace(/\/+$/, ''),
  API_KEY: apiKey,
  AUTH_TOKEN: optional(process.env.AUTH_TOKEN),
  TEST_USER_EMAIL: required(process.env.TEST_USER_EMAIL, 'eve.holt@reqres.in'),
  TEST_USER_PASSWORD: required(process.env.TEST_USER_PASSWORD, 'cityslicka'),
  REQUEST_TIMEOUT_MS: positiveNumber(process.env.REQUEST_TIMEOUT_MS, 15_000),
  LOG_LEVEL: logLevel(process.env.LOG_LEVEL),
  // Keyless ReqRes allows 20 requests per minute. Stay just below that unless
  // the caller provides an API key or explicitly overrides the limit.
  RATE_LIMIT_MAX_REQUESTS: nonNegativeNumber(process.env.RATE_LIMIT_MAX_REQUESTS, apiKey ? 0 : 18),
  RATE_LIMIT_WINDOW_MS: positiveNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
} as const;

export const buildDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (env.API_KEY) {
    headers['x-api-key'] = env.API_KEY;
  }

  return headers;
};

export const buildAuthHeaders = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
});
