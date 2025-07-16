import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';

import { initializeDatabase } from './infrastructure/database/sqlite';
import { TestController } from './infrastructure/http/controllers/TestController';
import { AuthController } from './infrastructure/http/controllers/AuthController';
import { RoutineController } from './infrastructure/http/controllers/RoutineController';

import { ProcessMessageUseCase } from './application/usecases/ProcessMessageUseCase';
import { GenerateRoutineUseCase } from './application/usecases/GenerateRoutineUseCase';

async function startServer() {
  // Inicializa o banco (cria tabelas se não existirem)
  await initializeDatabase();

  const app: Express = express();
  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(cors());
  app.use(express.json());

  // Instância dos casos de uso e controladores
  const processMessageUseCase = new ProcessMessageUseCase();
  const generateRoutineUseCase = new GenerateRoutineUseCase();
  const testController = new TestController(processMessageUseCase, generateRoutineUseCase);
  const authController = new AuthController();
  const routineController = new RoutineController();

  // Rotas de autenticação
  app.post('/api/register', async (req, res, next) => {
    try {
      await authController.register(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/login', async (req, res, next) => {
    try {
      await authController.login(req, res);
    } catch (err) {
      next(err);
    }
  });

  // Rotas para rotina (gerar, listar, buscar)
  app.post('/api/send-message', (req, res) => testController.processUserMessage(req, res));
  app.post('/api/generate-routine', (req, res) => testController.generateUserRoutine(req, res));
  app.get('/api/routines', async (req, res, next) => {
    try {
      await routineController.getAllRoutines(req, res);
    } catch (err) {
      next(err);
    }
  });
  app.get('/api/routines/:id', async (req, res, next) => {
    try {
      await routineController.getRoutineById(req, res);
    } catch (err) {
      next(err);
    }
  });

  // Start server
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Backend rodando em http://0.0.0.0:${port}`);

    // Loga todas as rotas registradas
    const stack = (app as any)?._router?.stack;
    if (Array.isArray(stack)) {
      const routes = stack
        .filter((layer: any) => layer.route && layer.route.path)
        .map((layer: any) => {
          const method = Object.keys(layer.route.methods)[0]?.toUpperCase();
          const path = layer.route.path;
          return `${method} ${path}`;
        });
      console.log("🔗 Rotas registradas:", routes);
    } else {
      console.log("⚠️ Não foi possível listar as rotas.");
    }
  });
}

startServer();
