"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite_1 = require("./infrastructure/database/sqlite");
const AuthController_1 = require("./infrastructure/http/controllers/AuthController");
const RoutineController_1 = require("./infrastructure/http/controllers/RoutineController");
async function startServer() {
    await (0, sqlite_1.initializeDatabase)();
    const app = (0, express_1.default)();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const authController = new AuthController_1.AuthController();
    const routineController = new RoutineController_1.RoutineController();
    // --- Rotas de Autenticação (CORRIGIDO) ---
    app.post('/api/register', async (req, res, next) => {
        try {
            await authController.register(req, res);
        }
        catch (error) {
            next(error);
        }
    });
    app.post('/api/login', async (req, res, next) => {
        try {
            await authController.login(req, res);
        }
        catch (error) {
            next(error);
        }
    });
    // --- Rotas para Rotina (CORRIGIDO) ---
    app.post('/api/generate-routine', async (req, res, next) => {
        try {
            await routineController.generateRoutine(req, res);
        }
        catch (error) {
            next(error);
        }
    });
    app.patch('/api/routines/:id', async (req, res, next) => {
        try {
            await routineController.updateRoutineStatus(req, res);
        }
        catch (error) {
            next(error);
        }
    });
    app.get('/api/routines', async (req, res, next) => {
        try {
            await routineController.getAllRoutines(req, res);
        }
        catch (error) {
            next(error);
        }
    });
    app.get('/api/routines/:id', async (req, res, next) => {
        try {
            await routineController.getRoutineById(req, res);
        }
        catch (error) {
            next(error);
        }
    });
    // Start server
    app.listen(port, '0.0.0.0', () => {
        console.log(`✅ Backend rodando em http://0.0.0.0:${port}`);
        // Log de rotas continua útil
        const stack = app?._router?.stack;
        if (Array.isArray(stack)) {
            const routes = stack
                .filter((layer) => layer.route && layer.route.path)
                .map((layer) => {
                const method = Object.keys(layer.route.methods)[0]?.toUpperCase();
                const path = layer.route.path; // Removido o '/api' duplicado
                return `${method} ${path}`;
            });
            console.log("🔗 Rotas registradas:", routes);
        }
    });
}
startServer();
