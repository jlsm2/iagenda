import { database } from '../database/sqlite';

// Nenhuma mudança na interface, ela já está correta.
export interface Routine {
  id?: number;
  user_id: number;
  title: string; // Ex: "Rotina de Segunda-feira"
  content: string; // O texto bruto gerado pela IA
  checked_activities?: string; // JSON string com status dos checks
  created_at?: Date;
}

export class RoutineRepository {
  async save(routine: Routine): Promise<Routine> { // ALTERADO: Retornar a rotina completa
    const [id] = await database('routines').insert(routine);
    const newRoutine = await this.findById(id);
    if (!newRoutine) {
      throw new Error('Falha ao salvar e recuperar a nova rotina.');
    }
    return newRoutine;
  }

  async findByUserId(userId: number): Promise<Routine[]> {
    return database('routines').where({ user_id: userId }).orderBy('created_at', 'desc');
  }

  async findById(id: number): Promise<Routine | undefined> {
    return database('routines').where({ id }).first();
  }

  // NOVO: Método para atualizar uma rotina existente.
  async update(id: number, data: Partial<Routine>): Promise<Routine | undefined> {
    await database('routines').where({ id }).update(data);
    return this.findById(id);
  }
}