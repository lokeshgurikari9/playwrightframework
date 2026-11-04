import { defineConfig } from '@playwright/test';
import { buildDefaultHeaders, env } from './config/env.config';

const useMockApi = /^(1|true)$/i.test(process.env.USE_MOCK_API ?? '');
const mockPort = Number(process.env.MOCK_API_PORT || 4010);
const baseURL = useMockApi ? `http://127.0.0.1:${mockPort}` : env.BASE_URL;

// The keyless demo API is rate limited, so throttle to a single worker while
// the client-side limiter is active (the default without an API key).
const isThrottled = !useMockApi && env.RATE_LIMIT_MAX_REQUESTS > 0;

export default defineConfig({
  testDir: './tests/api',
  timeout: 120_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: isThrottled ? 1 : process.env.CI ? 2 : 4,
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL,
    extraHTTPHeaders: buildDefaultHeaders(),
    trace: 'retain-on-failure',
  },
  ...(useMockApi
    ? {
        webServer: {
          command: 'node mock/server.mjs',
          port: mockPort,
          reuseExistingServer: !process.env.CI,
          env: { MOCK_API_PORT: String(mockPort) },
        },
      }
    : {}),
});
