"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const TestController_1 = require("./infrastructure/http/controllers/TestController");
const GetTestDataUseCase_1 = require("./application/usecases/GetTestDataUseCase");
const app = (0, express_1.default)();
const port = 3000; // Porta do backend
// Middlewares
app.use((0, cors_1.default)()); // Habilita CORS para permitir requisições do frontend
app.use(express_1.default.json());
// Instanciando casos de uso e controllers
const getTestDataUseCase = new GetTestDataUseCase_1.GetTestDataUseCase();
const testController = new TestController_1.TestController(getTestDataUseCase);
// Rotas
app.get('/api/test', (req, res) => testController.getTestData(req, res));
app.listen(port, () => {
    console.log(`🚀 Backend rodando em http://localhost:${port}`);
});
