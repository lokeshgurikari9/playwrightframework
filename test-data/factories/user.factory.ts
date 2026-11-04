import { CreateUserDto } from '../../models/request/user.dto';

export const buildCreateUserPayload = (overrides?: Partial<CreateUserDto>): CreateUserDto => ({
  name: `QA_User_${Date.now()}`,
  job: 'Automation Engineer',
  ...overrides,
});
