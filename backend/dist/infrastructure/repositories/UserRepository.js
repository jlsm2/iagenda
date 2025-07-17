"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const sqlite_1 = require("../database/sqlite");
class UserRepository {
    async create(user) {
        await (0, sqlite_1.database)('users').insert(user);
    }
    async findByEmail(email) {
        const user = await (0, sqlite_1.database)('users').where({ email }).first();
        return user;
    }
}
exports.UserRepository = UserRepository;
