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
const TestController_1 = require("./infrastructure/http/controllers/TestController");
const AuthController_1 = require("./infrastructure/http/controllers/AuthController");
const ProcessMessageUseCase_1 = require("./application/usecases/ProcessMessageUseCase");
const GenerateRoutineUseCase_1 = require("./application/usecases/GenerateRoutineUseCase");
async function startServer() {
    // Inicializa o banco (cria tabelas se não existirem)
    await (0, sqlite_1.initializeDatabase)();
    const app = (0, express_1.default)();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Instância dos casos de uso e controladores
    const processMessageUseCase = new ProcessMessageUseCase_1.ProcessMessageUseCase();
    const generateRoutineUseCase = new GenerateRoutineUseCase_1.GenerateRoutineUseCase();
    const testController = new TestController_1.TestController(processMessageUseCase, generateRoutineUseCase);
    const authController = new AuthController_1.AuthController();
    // Rotas de autenticação
    app.post('/api/register', async (req, res, next) => {
        try {
            await authController.register(req, res);
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/api/login', async (req, res, next) => {
        try {
            await authController.login(req, res);
        }
        catch (err) {
            next(err);
        }
    });
    // Rotas para rotina
    app.post('/api/send-message', (req, res) => testController.processUserMessage(req, res));
    app.post('/api/generate-routine', (req, res) => testController.generateUserRoutine(req, res));
    // Start server
    app.listen(port, '0.0.0.0', () => {
        console.log(`✅ Backend rodando em http://0.0.0.0:${port}`);
        // Verifica se _router existe e é válido
        const stack = app?._router?.stack;
        if (Array.isArray(stack)) {
            const routes = stack
                .filter((layer) => layer.route && layer.route.path)
                .map((layer) => {
                const method = Object.keys(layer.route.methods)[0]?.toUpperCase();
                const path = layer.route.path;
                return `${method} ${path}`;
            });
            console.log("🔗 Rotas registradas:", routes);
        }
        else {
            console.log("⚠️ Não foi possível listar as rotas.");
        }
    });
}
startServer();
