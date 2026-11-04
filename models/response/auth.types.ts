export interface LoginSuccessResponse {
  token: string;
}

export interface LoginErrorResponse {
  error: string;
}

export interface RegisterSuccessResponse {
  id: number;
  token: string;
}