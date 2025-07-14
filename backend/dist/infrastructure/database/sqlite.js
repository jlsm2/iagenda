"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
exports.initializeDatabase = initializeDatabase;
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(process.cwd(), 'history.sqlite');
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
        const tableExists = await exports.database.schema.hasTable('interactions');
        if (!tableExists) {
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
        else {
            const hasInputSummary = await exports.database.schema.hasColumn('interactions', 'input_summary');
            if (!hasInputSummary) {
                console.log("Adicionando coluna 'input_summary' à tabela 'interactions'...");
                await exports.database.schema.alterTable('interactions', (table) => {
                    table.text('input_summary');
                });
                console.log("Coluna 'input_summary' adicionada.");
            }
            else {
                console.log("Coluna 'input_summary' já existe.");
            }
        }
    }
    catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        process.exit(1);
    }
}
