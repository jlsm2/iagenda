import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import { initializeDatabase } from './infrastructure/database/sqlite'; // <-- 1. IMPORTAR O INICIALIZADOR
import { TestController } from './infrastructure/http/controllers/TestController';
import { ProcessMessageUseCase } from './application/usecases/ProcessMessageUseCase';
import { GenerateRoutineUseCase } from './application/usecases/GenerateRoutineUseCase';

// Usamos uma função async para poder usar 'await' na inicialização
async function startServer() {
  // 2. CHAMA A INICIALIZAÇÃO DO BANCO ANTES DE TUDO
  await initializeDatabase();

  const app: Express = express();
  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(cors());
  app.use(express.json());

  const processMessageUseCase = new ProcessMessageUseCase();
  const generateRoutineUseCase = new GenerateRoutineUseCase();
  const testController = new TestController(processMessageUseCase, generateRoutineUseCase);

  app.post('/api/send-message', (req, res) => testController.processUserMessage(req, res));
  app.post('/api/generate-routine', (req, res) => testController.generateUserRoutine(req, res));

  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend rodando em http://0.0.0.0:${port}`);
  });
}

// Inicia o servidor
startServer();
