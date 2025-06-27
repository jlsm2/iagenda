import { database } from '../database/sqlite'; // Importa nossa instância do Knex

// Interface para definir a estrutura dos dados de uma interação
export interface InteractionData {
  prompt: string;
  response?: string;
  error?: string;
  success: boolean;
}

export class InteractionRepository {
  /**
   * Salva uma nova interação na tabela 'interactions' do banco de dados.
   * @param data Os dados da interação a serem salvos.
   */
  async save(data: InteractionData): Promise<void> {
    try {
      // Usa o Knex para inserir uma nova linha na tabela 'interactions'
      await database('interactions').insert(data);
      console.log('Interação salva no histórico do banco de dados.');
    } catch (error) {
      console.error('Erro ao salvar interação no banco de dados:', error);
      // Aqui não relançamos o erro para não quebrar a resposta para o usuário,
      // mas registramos que a falha ocorreu.
    }
  }
}
