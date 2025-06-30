"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionRepository = void 0;
const sqlite_1 = require("../database/sqlite");
class InteractionRepository {
    async save(data) {
        try {
            await (0, sqlite_1.database)('interactions').insert(data);
            console.log('Interação salva no histórico do banco de dados.');
        }
        catch (error) {
            console.error('Erro ao salvar interação no banco de dados:', error);
        }
    }
}
exports.InteractionRepository = InteractionRepository;
