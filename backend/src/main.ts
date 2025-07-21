import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { initializeDatabase } from './infrastructure/database/sqlite';
import { AuthController } from './infrastructure/http/controllers/AuthController';
import { RoutineController } from './infrastructure/http/controllers/RoutineController';

async function startServer() {
  await initializeDatabase();

  const app: Express = express();
  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(cors());
  app.use(express.json());

  const authController = new AuthController();
  const routineController = new RoutineController();

  // --- Rotas de Autenticação (CORRIGIDO) ---
  app.post('/api/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.register(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.login(req, res);
    } catch (error) {
      next(error);
    }
  });

  // --- Rotas para Rotina (CORRIGIDO) ---
  app.post('/api/generate-routine', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routineController.generateRoutine(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/routines/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routineController.updateRoutineStatus(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/routines', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routineController.getAllRoutines(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/routines/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routineController.getRoutineById(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/routines/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routineController.deleteRoutine(req, res);
    } catch (error) {
      next(error);
    }
  });
  

  // Start server
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Backend rodando em http://0.0.0.0:${port}`);
    // Log de rotas continua útil
    const stack = (app as any)?._router?.stack;
    if (Array.isArray(stack)) {
      const routes = stack
        .filter((layer: any) => layer.route && layer.route.path)
        .map((layer: any) => {
          const method = Object.keys(layer.route.methods)[0]?.toUpperCase();
          const path = layer.route.path; // Removido o '/api' duplicado
          return `${method} ${path}`;
        });
      console.log("🔗 Rotas registradas:", routes);
    }
  });
}

startServer();