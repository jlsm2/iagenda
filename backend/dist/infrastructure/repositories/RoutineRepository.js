"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineRepository = void 0;
const sqlite_1 = require("../database/sqlite");
class RoutineRepository {
    async save(routine) {
        const [id] = await (0, sqlite_1.database)('routines').insert(routine);
        const newRoutine = await this.findById(id);
        if (!newRoutine) {
            throw new Error('Falha ao salvar e recuperar a nova rotina.');
        }
        return newRoutine;
    }
    async findByUserId(userId) {
        return (0, sqlite_1.database)('routines').where({ user_id: userId }).orderBy('created_at', 'desc');
    }
    async findById(id) {
        return (0, sqlite_1.database)('routines').where({ id }).first();
    }
    // NOVO: Método para atualizar uma rotina existente.
    async update(id, data) {
        await (0, sqlite_1.database)('routines').where({ id }).update(data);
        return this.findById(id);
    }
}
exports.RoutineRepository = RoutineRepository;
