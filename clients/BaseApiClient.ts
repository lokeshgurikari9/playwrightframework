import { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../config/env.config';
import { createLogger, type Logger } from '../utils/logger/logger';
import { apiRateLimiter } from '../utils/helpers/rateLimiter';
import { sleep } from '../utils/helpers/time';

export type QueryParams = Record<string, string | number | boolean>;

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: QueryParams;
  timeout?: number;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const MAX_RATE_LIMIT_RETRIES = 1;
const MAX_RATE_LIMIT_WAIT_MS = 65_000;

/**
 * Shared HTTP transport for every domain client. Keeps logging, timeout and
 * request-shaping concerns in one place so clients stay small.
 */
export abstract class BaseApiClient {
  private readonly logger: Logger;

  constructor(
    protected readonly request: APIRequestContext,
    clientName: string = 'ApiClient',
  ) {
    this.logger = createLogger(clientName);
  }

  protected get(url: string, params?: QueryParams, options?: Omit<RequestOptions, 'params'>): Promise<APIResponse> {
    return this.send('GET', url, { ...options, params });
  }

  protected post(url: string, data?: unknown, options?: RequestOptions): Promise<APIResponse> {
    return this.send('POST', url, options, data);
  }

  protected put(url: string, data?: unknown, options?: RequestOptions): Promise<APIResponse> {
    return this.send('PUT', url, options, data);
  }

  protected patch(url: string, data?: unknown, options?: RequestOptions): Promise<APIResponse> {
    return this.send('PATCH', url, options, data);
  }

  protected delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.send('DELETE', url, options);
  }

  private async send(
    method: HttpMethod,
    url: string,
    options: RequestOptions = {},
    data?: unknown,
  ): Promise<APIResponse> {
    for (let attempt = 0; ; attempt += 1) {
      await apiRateLimiter.acquire();

      const startedAt = Date.now();
      const response = await this.request.fetch(url, {
        method,
        data,
        headers: options.headers,
        params: options.params,
        timeout: options.timeout ?? env.REQUEST_TIMEOUT_MS,
      });

      this.logger.debug(`${method} ${url} -> ${response.status()} (${Date.now() - startedAt}ms)`);

      if (response.status() !== 429 || attempt >= MAX_RATE_LIMIT_RETRIES) {
        return response;
      }

      const waitMs = this.rateLimitDelayMs(response);
      this.logger.warn(`${method} ${url} was rate limited; retrying in ${waitMs}ms`);
      await sleep(waitMs);
    }
  }

  private rateLimitDelayMs(response: APIResponse): number {
    const headers = response.headers();
    const retryAfter = Number(headers['retry-after']);
    const resetSeconds = Number(headers['ratelimit-reset']);
    const requestedDelay = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : Number.isFinite(resetSeconds) && resetSeconds > 0
        ? resetSeconds * 1000
        : 1_000;

    return Math.min(requestedDelay + 250, MAX_RATE_LIMIT_WAIT_MS);
  }
}
