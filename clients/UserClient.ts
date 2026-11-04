import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { CreateUserDto, ListUsersParams, UpdateUserDto } from '../models/request/user.dto';
import { toQueryParams } from '../utils/helpers/queryParams';

export class UserClient extends BaseApiClient {
  private readonly endpoint = '/api/users';

  constructor(request: APIRequestContext) {
    super(request, 'UserClient');
  }

  async listUsers(params?: ListUsersParams): Promise<APIResponse> {
    return this.get(this.endpoint, toQueryParams(params));
  }

  async createUser(payload: CreateUserDto): Promise<APIResponse> {
    return this.post(this.endpoint, payload);
  }

  async getUserById(id: string | number): Promise<APIResponse> {
    return this.get(`${this.endpoint}/${id}`);
  }

  async updateUser(id: string | number, payload: UpdateUserDto): Promise<APIResponse> {
    return this.put(`${this.endpoint}/${id}`, payload);
  }

  async patchUser(id: string | number, payload: UpdateUserDto): Promise<APIResponse> {
    return this.patch(`${this.endpoint}/${id}`, payload);
  }

  async deleteUser(id: string | number): Promise<APIResponse> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}
