import { database } from '../database/sqlite';

export interface InteractionData {
  prompt: string;
  response?: string;
  error?: string;
  success: boolean;
  input_summary?: string; // Novo campo opcional
}

export class InteractionRepository {
  async save(data: InteractionData): Promise<void> {
    try {
      await database('interactions').insert(data);
      console.log('Interação salva no histórico do banco de dados.');
    } catch (error) {
      console.error('Erro ao salvar interação no banco de dados:', error);
    }
  }
}
