import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { LoginRequestDto, RegisterRequestDto } from '../models/request/auth.dto';

export class AuthClient extends BaseApiClient {
  private readonly loginEndpoint = '/api/login';
  private readonly registerEndpoint = '/api/register';
  private readonly logoutEndpoint = '/api/logout';

  /**
   * Authenticate user with credentials
   */
  async login(payload: LoginRequestDto): Promise<APIResponse> {
    return this.post(this.loginEndpoint, payload);
  }

  /**
   * Register a new user
   */
  async register(payload: RegisterRequestDto): Promise<APIResponse> {
    return this.post(this.registerEndpoint, payload);
  }

  /**
   * Perform logout or session termination
   */
  async logout(): Promise<APIResponse> {
    return this.post(this.logoutEndpoint);
  }
}