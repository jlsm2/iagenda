import { Request, Response } from 'express';
import { RoutineRepository } from '../../../infrastructure/repositories/RoutineRepository';

const routineRepo = new RoutineRepository();

export class RoutineController {
  async getAllRoutines(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.user_id;
      if (!userId) {
        res.status(400).json({ error: 'Parâmetro user_id é obrigatório.' });
        return;
      }
      const routines = await routineRepo.findByUserId(Number(userId));
      res.json(routines);
    } catch (error) {
      console.error('Erro ao buscar rotinas:', error);
      res.status(500).json({ error: 'Erro interno ao buscar rotinas.' });
    }
  }

  async getRoutineById(req: Request, res: Response): Promise<void> {
    try {
      const routineId = Number(req.params.id);
      const routine = await routineRepo.findById(routineId);
      if (!routine) {
        res.status(404).json({ error: 'Rotina não encontrada.' });
        return;
      }
      res.json(routine);
    } catch (error) {
      console.error('Erro ao buscar rotina:', error);
      res.status(500).json({ error: 'Erro interno ao buscar rotina.' });
    }
  }
  
}
