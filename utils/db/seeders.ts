import { InMemoryDbClient } from './dbClient';

export interface SeedUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export const defaultSeedUsers: SeedUser[] = [
  {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
  },
  {
    id: 2,
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver',
    avatar: 'https://reqres.in/img/faces/2-image.jpg',
  },
];

export function seedUsers(db: InMemoryDbClient, users: SeedUser[] = defaultSeedUsers): SeedUser[] {
  for (const user of users) {
    db.upsert('users', user);
  }

  return users;
}
