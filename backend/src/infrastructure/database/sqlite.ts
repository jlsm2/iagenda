import knex, { Knex } from 'knex';
import path from 'path';

// Define o nome e o caminho do arquivo do banco de dados.
// Ele será criado na raiz da pasta do seu projeto backend.
const dbPath = path.resolve(process.cwd(), 'history.sqlite');

// Configuração da conexão com o banco de dados SQLite usando o Knex
const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true, // Configuração padrão para SQLite
};

// Instância do Knex que será usada em toda a aplicação para falar com o banco
export const database = knex(dbConfig);

/**
 * Função para inicializar o banco de dados.
 * Ela garante que a nossa tabela de interações exista.
 */
export async function initializeDatabase() {
  try {
    const tableExists = await database.schema.hasTable('interactions');

    if (!tableExists) {
      console.log("Tabela 'interactions' não encontrada, criando...");
      await database.schema.createTable('interactions', (table) => {
        table.increments('id').primary(); // Coluna de ID auto-incremento
        table.timestamp('timestamp').defaultTo(database.fn.now()); // Data e hora da interação
        table.text('prompt').notNullable(); // O prompt enviado para a IA
        table.text('response'); // A resposta da IA (pode ser nula em caso de erro)
        table.text('error'); // O erro, caso tenha ocorrido
        table.boolean('success').notNullable(); // Um campo para saber se a chamada deu certo ou não
      });
      console.log("Tabela 'interactions' criada com sucesso!");
    } else {
      console.log("Tabela 'interactions' já existe.");
    }
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
    // Em uma aplicação real, talvez queiramos parar a aplicação se o banco não puder ser iniciado.
    process.exit(1);
  }
}
