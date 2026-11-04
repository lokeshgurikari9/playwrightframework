import { expect } from '@playwright/test';
import type { ZodType } from 'zod';

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  errors: string[];
}

/**
 * Validates unknown data against a Zod schema without throwing, returning
 * human-readable error paths that are safe to print in test reports.
 */
export function validateSchema<T>(schema: ZodType<T>, payload: unknown): SchemaValidationResult<T> {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => {
        const location = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        return `${location}: ${issue.message}`;
      }),
    };
  }

  return { success: true, data: result.data, errors: [] };
}

/**
 * Assert-and-narrow helper for response contracts. Returns the parsed, typed
 * data so tests can keep asserting on individual fields.
 */
export function expectSchema<T>(schema: ZodType<T>, payload: unknown, label = 'response'): T {
  const result = validateSchema(schema, payload);

  expect(
    result.success,
    `${label} failed schema validation:\n${result.errors.map((error) => `  - ${error}`).join('\n')}`,
  ).toBe(true);

  return result.data as T;
}
