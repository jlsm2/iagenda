"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const sqlite_1 = require("../../database/sqlite");
class AuthController {
    async register(req, res) {
        const { email, password } = req.body;
        const existingUser = await (0, sqlite_1.database)('users').where({ email }).first();
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe.' });
        }
        // Salva a senha sem hash (texto puro)
        await (0, sqlite_1.database)('users').insert({ email, password });
        res.json({ message: 'Usuário cadastrado com sucesso!' });
    }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await (0, sqlite_1.database)('users').where({ email }).first();
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }
        res.json({ message: 'Login realizado com sucesso!' });
    }
}
exports.AuthController = AuthController;
