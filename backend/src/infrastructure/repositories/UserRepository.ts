import { database } from '../database/sqlite';

export interface User {
  id?: number;
  email: string;
  password: string;
}

export class UserRepository {
  async create(user: User): Promise<void> {
    await database('users').insert(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await database('users').where({ email }).first();
    return user;
  }
}
