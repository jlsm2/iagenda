import { Request, Response } from 'express';
import { ProcessMessageUseCase } from '../../../application/usecases/ProcessMessageUseCase';
import { GenerateRoutineUseCase } from '../../../application/usecases/GenerateRoutineUseCase';

// Removido a interface Activity daqui, pois ela está definida nos Use Cases.

export class TestController {
  constructor(
    private processMessageUseCase: ProcessMessageUseCase,
    private generateRoutineUseCase: GenerateRoutineUseCase
  ) {}

  async processUserMessage(req: Request, res: Response): Promise<void> {
    // Se quiser manter o chat, a lógica viria aqui. Por enquanto, pode deixar vazio.
  }

  /**
   * Recebe atividades fixas e flexíveis e chama o Use Case para gerar a rotina.
   */
  async generateUserRoutine(req: Request, res: Response): Promise<void> {
    try {
      // Extrai as duas listas do corpo da requisição.
      const { fixedActivities, flexibleActivities } = req.body;

      // Validação básica
      if (!fixedActivities && !flexibleActivities) {
        res.status(400).json({ error: 'É necessário fornecer ao menos uma lista de atividades (fixedActivities ou flexibleActivities).' });
        return;
      }

      // Chama o Use Case com ambas as listas (mesmo que uma delas esteja vazia)
      const routineResponse = await this.generateRoutineUseCase.execute(fixedActivities || [], flexibleActivities || []);
      res.json({ response: routineResponse });

    } catch (error) {
      console.error("Erro ao gerar rotina no controller:", error);
      res.status(500).json({ error: 'Erro interno ao gerar a rotina.' });
    }
  }
}