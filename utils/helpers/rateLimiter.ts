import { env } from '../../config/env.config';
import { sleep } from './time';

/**
 * Client-side sliding-window limiter. It prevents the suite from tripping the
 * upstream rate limit, which is especially important for the shared, keyless
 * ReqRes demo environment. Set RATE_LIMIT_MAX_REQUESTS=0 (or provide an API
 * key) to disable it.
 */
export class SlidingWindowRateLimiter {
  private readonly timestamps: number[] = [];

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  async acquire(): Promise<void> {
    if (this.maxRequests <= 0) return;

    while (true) {
      const now = Date.now();

      while (this.timestamps.length > 0 && now - this.timestamps[0] >= this.windowMs) {
        this.timestamps.shift();
      }

      if (this.timestamps.length < this.maxRequests) {
        this.timestamps.push(now);
        return;
      }

      const waitMs = this.windowMs - (now - this.timestamps[0]) + 25;
      await sleep(waitMs);
    }
  }
}

const isMockMode = /^(1|true)$/i.test(process.env.USE_MOCK_API ?? '');

export const apiRateLimiter = new SlidingWindowRateLimiter(
  isMockMode ? 0 : env.RATE_LIMIT_MAX_REQUESTS,
  env.RATE_LIMIT_WINDOW_MS,
);
