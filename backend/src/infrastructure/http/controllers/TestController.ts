import { Request, Response } from 'express';
import { ProcessMessageUseCase } from '../../../application/usecases/ProcessMessageUseCase';
import { GenerateRoutineUseCase } from '../../../application/usecases/GenerateRoutineUseCase'; // Importar

interface Activity {
  name: string;
  startTime: string;
  endTime: string;
}

export class TestController {
  constructor(
    private processMessageUseCase: ProcessMessageUseCase,
    private generateRoutineUseCase: GenerateRoutineUseCase
  ) {}
  async processUserMessage(req: Request, res: Response): Promise<void> {}

  // Novo método para gerar rotina
  async generateUserRoutine(req: Request, res: Response): Promise<void> {
    const activities = req.body.activities as Activity[]; 
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
    res.status(400).json({ error: 'Nenhuma atividade fornecida ou formato inválido. Envie um JSON como {"activities": [ ...lista de atividades... ]}' });
    return;
    }

    const routineResponse = await this.generateRoutineUseCase.execute(activities);
    res.json({ response: routineResponse }); 
  }
}