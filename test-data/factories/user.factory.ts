import { CreateUserDto, UpdateUserDto } from '../../models/request/user.dto';

const uniqueSuffix = (): string => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const buildCreateUserPayload = (overrides?: Partial<CreateUserDto>): CreateUserDto => ({
  name: `QA_User_${uniqueSuffix()}`,
  job: 'Automation Engineer',
  ...overrides,
});

export const buildUpdateUserPayload = (overrides?: Partial<UpdateUserDto>): UpdateUserDto => ({
  name: `QA_Updated_${uniqueSuffix()}`,
  job: 'Senior Automation Engineer',
  ...overrides,
});

export const buildPatchUserPayload = (overrides?: Partial<UpdateUserDto>): UpdateUserDto => ({
  job: 'Staff Automation Engineer',
  ...overrides,
});
