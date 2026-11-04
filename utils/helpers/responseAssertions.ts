import { APIResponse, expect } from '@playwright/test';
import type { ZodType } from 'zod';
import { expectSchema } from '../helpers/schemaValidator';

const formatAllowedStatus = (expected: number | number[]): string =>
  Array.isArray(expected) ? expected.join(', ') : String(expected);

export function expectStatus(response: APIResponse, expected: number | number[]): void {
  const expectedStatuses = Array.isArray(expected) ? expected : [expected];

  expect(
    expectedStatuses,
    `Expected HTTP status ${formatAllowedStatus(expected)} but received ${response.status()}`,
  ).toContain(response.status());
}

export function expectJsonContentType(response: APIResponse): void {
  expect(response.headers()['content-type']).toContain('application/json');
}

export async function expectJsonBody<T>(response: APIResponse): Promise<T> {
  expectJsonContentType(response);
  return (await response.json()) as T;
}

export async function expectJsonSchema<T>(
  response: APIResponse,
  schema: ZodType<T>,
  label = 'response',
): Promise<T> {
  const body = await response.json();
  return expectSchema(schema, body, label);
}

export interface TimedResult<T> {
  result: T;
  durationMs: number;
}

export async function measureDuration<T>(operation: () => Promise<T>): Promise<TimedResult<T>> {
  const startedAt = Date.now();
  const result = await operation();
  return { result, durationMs: Date.now() - startedAt };
}

export function expectDurationBelow(durationMs: number, maxMs: number, label = 'request'): void {
  expect(durationMs, `${label} took ${durationMs}ms, expected <= ${maxMs}ms`).toBeLessThanOrEqual(maxMs);
}
