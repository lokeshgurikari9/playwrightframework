```markdown
# Playwright API Automation Framework

A production-grade, modular backend API automation framework built with [Playwright Test](https://playwright.dev/) and TypeScript. Designed for reliability, type safety, fast parallel execution, and clean separation between test logic, service clients, and data fixtures.

---

## Architecture Overview

```text
api-automation/
├── .github/workflows/          # CI/CD pipelines (GitHub Actions)
├── config/                     # Environment and test runner configurations
├── fixtures/                   # Custom Playwright test fixtures (Auth, API contexts)
├── models/
│   ├── request/                # Strongly-typed request payloads (DTOs)
│   └── response/               # Strongly-typed response interfaces
├── clients/                    # Service layer (API Object Model / Service wrappers)
├── schemas/                    # JSON / Zod response validation schemas
├── tests/
│   └── api/                    # Spec files organized by API domains
├── test-data/
│   ├── factories/              # Dynamic payload factories
│   └── static/                 # Fixed payloads, mocks, and edge cases
├── utils/                      # Database helpers, schema validators, loggers
├── .env.example                # Template for environment variables
├── playwright.config.ts        # Central Playwright test configuration
└── tsconfig.json               # TypeScript compiler configuration

```

---

## Features

* **No Browser Overhead:** Uses Playwright's `APIRequestContext` for lightweight, millisecond-level HTTP execution.
* **Service Layer Pattern:** Encapsulates endpoints and HTTP methods inside reusable domain clients (`AuthClient`, `UserClient`).
* **Dependency-Injected Fixtures:** Automatic bearer token generation, credential management, and pre-authenticated contexts via `test.extend()`.
* **Strong Typing:** Comprehensive TypeScript DTOs for request payloads and response contracts.
* **Deterministic Test Data:** Dynamic data generation using factory functions to isolate test runs.
* **CI/CD Ready:** Pre-configured GitHub Actions workflow uploading HTML reports on completion.

---

## Prerequisites

* [Node.js](https://nodejs.org/) `>= 20.x`
* `npm` `>= 9.x`

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd api-automation
npm install

```

### 2. Configure Environment Variables

Copy the sample environment file and set your target environment variables:

```bash
cp .env.example .env

```

Edit `.env`:

```ini
BASE_URL=[https://reqres.in](https://reqres.in)
AUTH_TOKEN=your_token_here
TEST_USER_EMAIL=eve.holt@reqres.in
TEST_USER_PASSWORD=cityslicka

```

---

## Running Tests

| Command | Description |
| --- | --- |
| `npm test` | Runs all API tests headlessly in parallel |
| `npx playwright test tests/api/auth/` | Runs tests in a specific folder |
| `npx playwright test --grep "@smoke"` | Runs tests matching a tag |
| `npm run test:debug` | Runs tests in interactive debug mode |
| `npx playwright test --ui` | Opens the interactive Playwright UI mode |
| `npm run report` | Opens the latest HTML test report |

---

## Writing a New API Test

### 1. Define Request/Response DTOs

```typescript
// models/request/user.dto.ts
export interface CreateUserDto {
  name: string;
  job: string;
}

```

### 2. Add an Endpoint Method to the Client

```typescript
// clients/UserClient.ts
import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { CreateUserDto } from '../models/request/user.dto';

export class UserClient extends BaseApiClient {
  async createUser(payload: CreateUserDto): Promise<APIResponse> {
    return this.post('/api/users', payload);
  }
}

```

### 3. Consume in a Test Spec

```typescript
// tests/api/users/create-user.spec.ts
import { test, expect } from '../../../fixtures/api.fixture';
import { buildCreateUserPayload } from '../../../test-data/factories/user.factory';

test('POST /api/users - creates user successfully', async ({ userClient }) => {
  const payload = buildCreateUserPayload({ name: 'Jordan', job: 'QA Lead' });
  const response = await userClient.createUser(payload);

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.name).toBe(payload.name);
  expect(body).toHaveProperty('id');
});

```

---

## Continuous Integration

The repository includes a GitHub Actions workflow located at `.github/workflows/api-tests.yml`. It runs on every `push` and `pull_request` targeting `main`:

* Installs dependencies via `npm ci`
* Executes API tests headlessly
* Retains HTML test execution reports as build artifacts for 14 days

```

``````markdown
# Playwright API Automation Framework

A production-grade, modular backend API automation framework built with [Playwright Test](https://playwright.dev/) and TypeScript. Designed for reliability, type safety, fast parallel execution, and clean separation between test logic, service clients, and data fixtures.

---

## Architecture Overview

```text
api-automation/
├── .github/workflows/          # CI/CD pipelines (GitHub Actions)
├── config/                     # Environment and test runner configurations
├── fixtures/                   # Custom Playwright test fixtures (Auth, API contexts)
├── models/
│   ├── request/                # Strongly-typed request payloads (DTOs)
│   └── response/               # Strongly-typed response interfaces
├── clients/                    # Service layer (API Object Model / Service wrappers)
├── schemas/                    # JSON / Zod response validation schemas
├── tests/
│   └── api/                    # Spec files organized by API domains
├── test-data/
│   ├── factories/              # Dynamic payload factories
│   └── static/                 # Fixed payloads, mocks, and edge cases
├── utils/                      # Database helpers, schema validators, loggers
├── .env.example                # Template for environment variables
├── playwright.config.ts        # Central Playwright test configuration
└── tsconfig.json               # TypeScript compiler configuration

```

---

## Features

* **No Browser Overhead:** Uses Playwright's `APIRequestContext` for lightweight, millisecond-level HTTP execution.
* **Service Layer Pattern:** Encapsulates endpoints and HTTP methods inside reusable domain clients (`AuthClient`, `UserClient`).
* **Dependency-Injected Fixtures:** Automatic bearer token generation, credential management, and pre-authenticated contexts via `test.extend()`.
* **Strong Typing:** Comprehensive TypeScript DTOs for request payloads and response contracts.
* **Deterministic Test Data:** Dynamic data generation using factory functions to isolate test runs.
* **CI/CD Ready:** Pre-configured GitHub Actions workflow uploading HTML reports on completion.

---

## Prerequisites

* [Node.js](https://nodejs.org/) `>= 20.x`
* `npm` `>= 9.x`

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd api-automation
npm install

```

### 2. Configure Environment Variables

Copy the sample environment file and set your target environment variables:

```bash
cp .env.example .env

```

Edit `.env`:

```ini
BASE_URL=[https://reqres.in](https://reqres.in)
AUTH_TOKEN=your_token_here
TEST_USER_EMAIL=eve.holt@reqres.in
TEST_USER_PASSWORD=cityslicka

```

---

## Running Tests

| Command | Description |
| --- | --- |
| `npm test` | Runs all API tests headlessly in parallel |
| `npx playwright test tests/api/auth/` | Runs tests in a specific folder |
| `npx playwright test --grep "@smoke"` | Runs tests matching a tag |
| `npm run test:debug` | Runs tests in interactive debug mode |
| `npx playwright test --ui` | Opens the interactive Playwright UI mode |
| `npm run report` | Opens the latest HTML test report |

---

## Writing a New API Test

### 1. Define Request/Response DTOs

```typescript
// models/request/user.dto.ts
export interface CreateUserDto {
  name: string;
  job: string;
}

```

### 2. Add an Endpoint Method to the Client

```typescript
// clients/UserClient.ts
import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { CreateUserDto } from '../models/request/user.dto';

export class UserClient extends BaseApiClient {
  async createUser(payload: CreateUserDto): Promise<APIResponse> {
    return this.post('/api/users', payload);
  }
}

```

### 3. Consume in a Test Spec

```typescript
// tests/api/users/create-user.spec.ts
import { test, expect } from '../../../fixtures/api.fixture';
import { buildCreateUserPayload } from '../../../test-data/factories/user.factory';

test('POST /api/users - creates user successfully', async ({ userClient }) => {
  const payload = buildCreateUserPayload({ name: 'Jordan', job: 'QA Lead' });
  const response = await userClient.createUser(payload);

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.name).toBe(payload.name);
  expect(body).toHaveProperty('id');
});

```

---

## Continuous Integration

The repository includes a GitHub Actions workflow located at `.github/workflows/api-tests.yml`. It runs on every `push` and `pull_request` targeting `main`:

* Installs dependencies via `npm ci`
* Executes API tests headlessly
* Retains HTML test execution reports as build artifacts for 14 days

```

```