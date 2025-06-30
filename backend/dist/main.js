"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite_1 = require("./infrastructure/database/sqlite"); // <-- 1. IMPORTAR O INICIALIZADOR
const TestController_1 = require("./infrastructure/http/controllers/TestController");
const ProcessMessageUseCase_1 = require("./application/usecases/ProcessMessageUseCase");
const GenerateRoutineUseCase_1 = require("./application/usecases/GenerateRoutineUseCase");
// Usamos uma função async para poder usar 'await' na inicialização
async function startServer() {
    // 2. CHAMA A INICIALIZAÇÃO DO BANCO ANTES DE TUDO
    await (0, sqlite_1.initializeDatabase)();
    const app = (0, express_1.default)();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const processMessageUseCase = new ProcessMessageUseCase_1.ProcessMessageUseCase();
    const generateRoutineUseCase = new GenerateRoutineUseCase_1.GenerateRoutineUseCase();
    const testController = new TestController_1.TestController(processMessageUseCase, generateRoutineUseCase);
    app.post('/api/send-message', (req, res) => testController.processUserMessage(req, res));
    app.post('/api/generate-routine', (req, res) => testController.generateUserRoutine(req, res));
    app.listen(port, '0.0.0.0', () => {
        console.log(`Backend rodando em http://0.0.0.0:${port}`);
    });
}
// Inicia o servidor
startServer();
