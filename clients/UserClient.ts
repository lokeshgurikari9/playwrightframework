import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { CreateUserDto, UpdateUserDto } from '../models/request/user.dto';

export class UserClient extends BaseApiClient {
  private readonly endpoint = '/api/users';

  async createUser(payload: CreateUserDto): Promise<APIResponse> {
    return this.post(this.endpoint, payload);
  }

  async getUserById(id: string | number): Promise<APIResponse> {
    return this.get(`${this.endpoint}/${id}`);
  }

  async updateUser(id: string | number, payload: UpdateUserDto): Promise<APIResponse> {
    return this.put(`${this.endpoint}/${id}`, payload);
  }

  async deleteUser(id: string | number): Promise<APIResponse> {
    return this.delete(`${this.endpoint}/${id}`);
  }
}
