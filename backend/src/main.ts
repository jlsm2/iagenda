import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import { TestController } from './infrastructure/http/controllers/TestController';
import { ProcessMessageUseCase } from './application/usecases/ProcessMessageUseCase';
import { GenerateRoutineUseCase } from './application/usecases/GenerateRoutineUseCase';

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;


app.use(cors());
app.use(express.json());

const processMessageUseCase = new ProcessMessageUseCase();
const generateRoutineUseCase = new GenerateRoutineUseCase();

const testController = new TestController(
  processMessageUseCase,
  generateRoutineUseCase 
);

app.post('/api/send-message', (req, res) => testController.processUserMessage(req, res)); 
app.post('/api/generate-routine', (req, res) => testController.generateUserRoutine(req, res)); 

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
  console.log(`Endpoint de chat POST: http://localhost:${port}/api/send-message`);
  console.log(`Endpoint de gerar rotina POST: http://localhost:${port}/api/generate-routine`);
});