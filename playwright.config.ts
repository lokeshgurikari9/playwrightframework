import { defineConfig } from '@playwright/test';
import { env } from './config/env.config';

export default defineConfig({
  testDir: './tests/api',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.BASE_URL,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    trace: 'retain-on-failure',
  },
});
