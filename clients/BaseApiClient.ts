import { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async get(url: string, params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(url, { params });
  }

  protected async post(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.post(url, { data });
  }

  protected async put(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.put(url, { data });
  }

  protected async delete(url: string): Promise<APIResponse> {
    return this.request.delete(url);
  }
}
