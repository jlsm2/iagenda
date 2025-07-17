import { Request, Response } from 'express';
import { RoutineRepository } from '../../../infrastructure/repositories/RoutineRepository';
import { GenerateRoutineUseCase } from '../../../application/usecases/GenerateRoutineUseCase';

const routineRepo = new RoutineRepository();
const generateRoutineUseCase = new GenerateRoutineUseCase();

export class RoutineController {
  // NOVO: Método para gerar E SALVAR uma nova rotina
  async generateRoutine(req: Request, res: Response): Promise<void> {
    try {
      const { fixedActivities, flexibleActivities, userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'O campo userId é obrigatório.' });
        return;
      }
      
      // 1. Gera o conteúdo da rotina usando o UseCase
      const routineContent = await generateRoutineUseCase.execute(fixedActivities, flexibleActivities);

      // 2. Cria o objeto da rotina para salvar
      const routineToSave = {
        user_id: userId,
        title: `Rotina de ${new Date().toLocaleDateString('pt-BR')}`, // Título dinâmico
        content: routineContent,
        checked_activities: '{}' // Começa com nenhuma atividade checada
      };

      // 3. Salva no banco de dados usando o repositório
      const savedRoutine = await routineRepo.save(routineToSave);
      
      // 4. Retorna a rotina completa (com ID) para o frontend
      res.status(201).json(savedRoutine);

    } catch (error) {
      console.error('Erro ao gerar rotina:', error);
      res.status(500).json({ error: 'Erro interno ao gerar rotina.' });
    }
  }

  // NOVO: Método para atualizar o status das atividades
  async updateRoutineStatus(req: Request, res: Response): Promise<void> {
    try {
      const routineId = Number(req.params.id);
      const { checked_activities } = req.body;

      if (typeof checked_activities === 'undefined') {
        res.status(400).json({ error: 'O campo checked_activities é obrigatório.' });
        return;
      }

      const updatedRoutine = await routineRepo.update(routineId, { checked_activities });

      if (!updatedRoutine) {
        res.status(404).json({ error: 'Rotina não encontrada.' });
        return;
      }

      res.json(updatedRoutine);

    } catch (error) {
      console.error('Erro ao atualizar rotina:', error);
      res.status(500).json({ error: 'Erro interno ao atualizar rotina.' });
    }
  }

  // --- MÉTODOS EXISTENTES (sem alterações) ---
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