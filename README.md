# Playwright API Automation Framework

A production-grade, modular backend API automation framework built with [Playwright Test](https://playwright.dev/) and TypeScript. It is designed for reliability, type safety, fast parallel execution, and a clean separation between tests, service clients, contracts, and test data.

---

## Architecture Overview

```text
api-automation/
├── .github/workflows/          # CI/CD pipelines (GitHub Actions)
├── config/                     # Environment, headers, and runner configuration
├── fixtures/                   # Custom Playwright fixtures (auth, API clients, data store)
├── models/
│   ├── request/                # Strongly-typed request payloads (DTOs)
│   └── response/               # Strongly-typed response interfaces
├── clients/                    # Service layer (API Object Model / service wrappers)
├── mock/                       # Local mock API for deterministic/offline runs
├── schemas/                    # Zod response contracts
├── tests/
│   └── api/                    # Spec files organized by API domain
├── test-data/
│   ├── factories/              # Dynamic payload factories
│   └── static/                 # Fixed payloads and edge cases
├── utils/
│   ├── db/                     # In-memory data store and seeders
│   ├── helpers/                # Schema, token, assertion, and retry helpers
│   └── logger/                 # Configurable structured logger
├── .env.example                # Template for environment variables
├── playwright.config.ts        # Central Playwright test configuration
└── tsconfig.json               # TypeScript compiler configuration
```

---

## Features

- **No browser overhead** — uses Playwright's `APIRequestContext` for lightweight HTTP execution.
- **Service layer pattern** — domain clients (`AuthClient`, `UserClient`, `ResourceClient`) encapsulate endpoints and HTTP verbs.
- **Dependency-injected fixtures** — a single `test` import exposes auth, user, resource, and in-memory data-store fixtures.
- **Dynamic authentication** — the `authToken` fixture logs in automatically and the `authenticatedApiContext` fixture injects the bearer token.
- **Contract testing with Zod** — every response is validated against a schema, with readable error paths on failure.
- **Strong typing** — request DTOs, response models, and schema-inferred types throughout.
- **Deterministic test data** — factories generate unique data so parallel runs do not collide.
- **Tag-based suites** — `@smoke`, `@regression`, and `@negative` tags for targeted runs.
- **Rate-limit awareness** — a client-side sliding-window limiter plus `429` retry protects shared demo environments.
- **Offline mock mode** — `npm run test:mock` starts a local contract-compatible API, so the whole suite runs without a network or quota.
- **Reusable assertions and utilities** — status/content-type/schema assertions, token parsing, retry, and duration measurement.
- **CI ready** — type-checks, tests, and uploads HTML/JSON reports as build artifacts.

---

## Prerequisites

- [Node.js](https://nodejs.org/) `>= 20.x`
- `npm` `>= 9.x`

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `BASE_URL` | No | `https://reqres.in` | Target API base URL. |
| `API_KEY` | No | — | Sent as `x-api-key` when provided. Raises ReqRes rate limits. |
| `AUTH_TOKEN` | No | — | Static bearer token for external consumers of the config. |
| `TEST_USER_EMAIL` | No | `eve.holt@reqres.in` | Login fixture user. |
| `TEST_USER_PASSWORD` | No | `cityslicka` | Login fixture password. |
| `REQUEST_TIMEOUT_MS` | No | `15000` | Per-request timeout. |
| `LOG_LEVEL` | No | `warn` | `debug`, `info`, `warn`, `error`, or `silent`. |
| `RATE_LIMIT_MAX_REQUESTS` | No | `18` (keyless), `0` with key | Max requests per window; `0` disables throttling. |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate-limit window size. |

Placeholder values such as `your_api_key_here` are ignored, so an unconfigured key is never sent to the API.

---

## Running Tests

| Command | Description |
| --- | --- |
| `npm test` | Runs all API tests in parallel. |
| `npm run test:mock` | Runs all tests against the local mock API (no network). |
| `npm run test:smoke` | Runs only `@smoke` tests. |
| `npm run test:regression` | Runs only `@regression` tests. |
| `npm run test:negative` | Runs only `@negative` tests. |
| `npx playwright test tests/api/users/` | Runs a specific folder. |
| `npm run test:debug` | Runs tests in interactive debug mode. |
| `npx playwright test --ui` | Opens the interactive Playwright UI. |
| `npm run typecheck` | Runs `tsc --noEmit`. |
| `npm run report` | Opens the latest HTML report. |

> **Rate limits:** the keyless ReqRes demo allows roughly 20 requests per minute and 40 per day. Without an `API_KEY`, the framework throttles to 18 requests per minute and runs one worker. The base client also retries `429` responses using `retry-after` / `ratelimit-reset`. Use `npm run test:mock` for unlimited, deterministic runs.

---

## Writing a New API Test

### 1. Define request and response types

```typescript
// models/request/user.dto.ts
export interface CreateUserDto {
  name: string;
  job: string;
}
```

### 2. Add an endpoint method to the client

```typescript
// clients/UserClient.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';

export class UserClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'UserClient');
  }

  async createUser(payload: CreateUserDto): Promise<APIResponse> {
    return this.post('/api/users', payload);
  }
}
```

### 3. Define a Zod contract

```typescript
// schemas/user.schema.ts
import { z } from 'zod';

export const createdUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  job: z.string().min(1),
  createdAt: z.iso.datetime(),
});
```

### 4. Write the spec

```typescript
import { test, expect } from '../../../fixtures/api.fixture';
import { createdUserSchema } from '../../../schemas/user.schema';
import { buildCreateUserPayload } from '../../../test-data/factories/user.factory';
import { expectJsonSchema, expectStatus } from '../../../utils/helpers/responseAssertions';

test('@smoke POST /api/users - creates a user', async ({ userClient }) => {
  const payload = buildCreateUserPayload();
  const response = await userClient.createUser(payload);

  expectStatus(response, 201);
  const body = await expectJsonSchema(response, createdUserSchema, 'create user response');

  expect(body.name).toBe(payload.name);
  expect(body.job).toBe(payload.job);
});
```

---

## Fixtures

Import `test` from `fixtures/api.fixture.ts` to get the full surface:

| Fixture | Type | Purpose |
| --- | --- | --- |
| `request` | `APIRequestContext` | Playwright's default unauthenticated context. |
| `authClient` | `AuthClient` | Login and registration endpoints. |
| `authToken` | `string` | Token generated from the configured test user. |
| `authenticatedApiContext` | `APIRequestContext` | Context with `Authorization: Bearer <token>`. |
| `userClient` | `UserClient` | User CRUD and pagination. |
| `resourceClient` | `ResourceClient` | Read-only `/api/unknown` resources. |

Use `fixtures/db.fixture.ts` for an isolated in-memory store when a test needs seeded local state.

---

## Continuous Integration

`.github/workflows/api-tests.yml` runs on pushes and pull requests targeting `main`:

1. Installs dependencies with `npm ci`.
2. Runs `npm run typecheck`.
3. Runs the live suite when an API key secret is configured; otherwise runs the mock suite.
4. Uploads `playwright-report/` and `test-results/` artifacts for 14 days.

Configure `BASE_URL`, `TEST_USER_EMAIL`, and the `REQRES_API_KEY` / `REQRES_TEST_PASSWORD` secrets in the repository settings to override the defaults.

---

## Mock API

`mock/server.mjs` implements the endpoints used by the suite with the same response contracts as ReqRes. It starts automatically when `USE_MOCK_API=1`:

```bash
npm run test:mock
```

This mode is useful for offline development, CI without secrets, and fast feedback. It mirrors pagination, validation errors, `404` responses, and ReqRes' bearer/API-key behaviour.
