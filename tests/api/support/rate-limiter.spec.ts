import { test, expect } from '@playwright/test';
import { SlidingWindowRateLimiter } from '../../../utils/helpers/rateLimiter';

test.describe('Rate limiter', () => {
  test('@regression waits once the sliding window is full', async () => {
    const limiter = new SlidingWindowRateLimiter(2, 50);

    await limiter.acquire();
    await limiter.acquire();

    const startedAt = Date.now();
    await limiter.acquire();

    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(40);
  });

  test('@regression is a no-op when the limit is disabled', async () => {
    const limiter = new SlidingWindowRateLimiter(0, 10_000);
    const startedAt = Date.now();

    await limiter.acquire();
    await limiter.acquire();

    expect(Date.now() - startedAt).toBeLessThan(500);
  });
});
