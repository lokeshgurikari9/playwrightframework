import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { ListUsersParams } from '../models/request/user.dto';
import { toQueryParams } from '../utils/helpers/queryParams';

/**
 * ReqRes exposes colour resources under /api/unknown. They are read-only demo
 * data, which makes them ideal for pagination and contract tests.
 */
export class ResourceClient extends BaseApiClient {
  private readonly endpoint = '/api/unknown';

  constructor(request: APIRequestContext) {
    super(request, 'ResourceClient');
  }

  async listResources(params?: ListUsersParams): Promise<APIResponse> {
    return this.get(this.endpoint, toQueryParams(params));
  }

  async getResourceById(id: string | number): Promise<APIResponse> {
    return this.get(`${this.endpoint}/${id}`);
  }
}
