import { database } from '../database/sqlite';

export interface Routine {
  id?: number;
  user_id: number;
  title: string;
  content: string;
  checked_activities?: string; // JSON string com status dos checks
  created_at?: Date;
}

export class RoutineRepository {
  async save(routine: Routine): Promise<number> {
    const [id] = await database('routines').insert(routine);
    return id;
  }

  async findByUserId(userId: number): Promise<Routine[]> {
    return database('routines').where({ user_id: userId }).orderBy('created_at', 'desc');
  }

  async findById(id: number): Promise<Routine | undefined> {
    return database('routines').where({ id }).first();
  }
  
}
