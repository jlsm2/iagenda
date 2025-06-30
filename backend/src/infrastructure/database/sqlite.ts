import knex, { Knex } from 'knex';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'history.sqlite');

const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
};

export const database = knex(dbConfig);

export async function initializeDatabase() {
  try {
    const tableExists = await database.schema.hasTable('interactions');

    if (!tableExists) {
      console.log("Tabela 'interactions' não encontrada, criando...");
      await database.schema.createTable('interactions', (table) => {
        table.increments('id').primary();
        table.timestamp('timestamp').defaultTo(database.fn.now());
        table.text('prompt').notNullable();
        table.text('input_summary');
        table.text('response');
        table.text('error');
        table.boolean('success').notNullable();
      });
      console.log("Tabela 'interactions' criada com sucesso!");
    } else {
      const hasInputSummary = await database.schema.hasColumn('interactions', 'input_summary');
      if (!hasInputSummary) {
        console.log("Adicionando coluna 'input_summary' à tabela 'interactions'...");
        await database.schema.alterTable('interactions', (table) => {
          table.text('input_summary');
        });
        console.log("Coluna 'input_summary' adicionada.");
      } else {
        console.log("Coluna 'input_summary' já existe.");
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
    process.exit(1);
  }
}
