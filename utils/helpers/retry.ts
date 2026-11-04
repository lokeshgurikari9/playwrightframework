import { sleep } from './time';

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number) => void;
}

/**
 * Retries an async operation with a fixed delay. Intended for eventually
 * consistent operations such as waiting for a resource to become readable.
 */
export async function retry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, delayMs = 250, shouldRetry = () => true, onRetry } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const attemptsRemain = attempt < retries;

      if (!attemptsRemain || !shouldRetry(error, attempt)) break;
      onRetry?.(error, attempt + 1);
      await sleep(delayMs);
    }
  }

  throw lastError;
}
