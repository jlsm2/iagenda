"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
exports.initializeDatabase = initializeDatabase;
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(__dirname, '../../../data/history.sqlite');
const dbConfig = {
    client: 'sqlite3',
    connection: {
        filename: dbPath,
    },
    useNullAsDefault: true,
};
exports.database = (0, knex_1.default)(dbConfig);
async function initializeDatabase() {
    try {
        const usersTableExists = await exports.database.schema.hasTable('users');
        if (!usersTableExists) {
            console.log("Tabela 'users' não encontrada, criando...");
            await exports.database.schema.createTable('users', (table) => {
                table.increments('id').primary();
                table.string('email').notNullable().unique();
                table.string('password').notNullable();
                table.timestamp('created_at').defaultTo(exports.database.fn.now());
            });
            console.log("Tabela 'users' criada com sucesso!");
        }
        else {
            console.log("Tabela 'users' já existe.");
        }
        const interactionsTableExists = await exports.database.schema.hasTable('interactions');
        if (!interactionsTableExists) {
            console.log("Tabela 'interactions' não encontrada, criando...");
            await exports.database.schema.createTable('interactions', (table) => {
                table.increments('id').primary();
                table.timestamp('timestamp').defaultTo(exports.database.fn.now());
                table.text('prompt').notNullable();
                table.text('input_summary');
                table.text('response');
                table.text('error');
                table.boolean('success').notNullable();
            });
            console.log("Tabela 'interactions' criada com sucesso!");
        }
        const routinesTableExists = await exports.database.schema.hasTable('routines');
        if (!routinesTableExists) {
            console.log("Tabela 'routines' não encontrada, criando...");
            await exports.database.schema.createTable('routines', (table) => {
                table.increments('id').primary();
                table.integer('user_id').notNullable();
                table.string('title').notNullable();
                table.text('content').notNullable();
                table.text('checked_activities').nullable();
                table.timestamp('created_at').defaultTo(exports.database.fn.now());
                table.foreign('user_id').references('users.id').onDelete('CASCADE');
            });
            console.log("Tabela 'routines' criada com sucesso!");
        }
        else {
            console.log("Tabela 'routines' já existe.");
        }
    }
    catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        process.exit(1);
    }
}
