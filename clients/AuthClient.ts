import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { LoginRequestDto, RegisterRequestDto } from '../models/request/auth.dto';
import { LoginSuccessResponse } from '../models/response/auth.types';

export class AuthClient extends BaseApiClient {
  private readonly loginEndpoint = '/api/login';
  private readonly registerEndpoint = '/api/register';
  private readonly logoutEndpoint = '/api/logout';

  constructor(request: APIRequestContext) {
    super(request, 'AuthClient');
  }

  /**
   * Authenticate user with credentials
   */
  async login(payload: LoginRequestDto): Promise<APIResponse> {
    return this.post(this.loginEndpoint, payload);
  }

  /**
   * Authenticate and return the parsed token, throwing a descriptive error for
   * non-2xx responses. Handy for fixtures and setup code.
   */
  async loginAndGetToken(payload: LoginRequestDto): Promise<LoginSuccessResponse> {
    const response = await this.login(payload);

    if (!response.ok()) {
      throw new Error(`Login failed with HTTP ${response.status()}: ${await response.text()}`);
    }

    return (await response.json()) as LoginSuccessResponse;
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
