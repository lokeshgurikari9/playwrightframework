import { test, expect } from '@playwright/test';
import { retry } from '../../../utils/helpers/retry';

test.describe('Retry helper', () => {
  test('@regression retries transient failures until success', async () => {
    let attempts = 0;

    const result = await retry(
      async () => {
        attempts += 1;
        if (attempts < 3) throw new Error('transient failure');
        return 'ok';
      },
      { retries: 3, delayMs: 1 },
    );

    expect(result).toBe('ok');
    expect(attempts).toBe(3);
  });

  test('@regression stops when the retry predicate rejects an error', async () => {
    let attempts = 0;

    await expect(
      retry(
        async () => {
          attempts += 1;
          throw new Error('permanent failure');
        },
        { retries: 3, delayMs: 1, shouldRetry: () => false },
      ),
    ).rejects.toThrow('permanent failure');

    expect(attempts).toBe(1);
  });
});
