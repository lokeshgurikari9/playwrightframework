export interface CreateUserDto {
  name: string;
  job: string;
}

export interface UpdateUserDto {
  name?: string;
  job?: string;
}

export interface ListUsersParams {
  page?: number;
  per_page?: number;
  delay?: number;
}
