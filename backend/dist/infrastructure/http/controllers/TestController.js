"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const RoutineRepository_1 = require("../../../infrastructure/repositories/RoutineRepository");
// Removido a interface Activity daqui, pois ela está definida nos Use Cases.
class TestController {
    constructor(processMessageUseCase, generateRoutineUseCase) {
        this.processMessageUseCase = processMessageUseCase;
        this.generateRoutineUseCase = generateRoutineUseCase;
        this.routineRepo = new RoutineRepository_1.RoutineRepository();
    }
    async processUserMessage(req, res) {
        // Se quiser manter o chat, a lógica viria aqui. Por enquanto, pode deixar vazio.
    }
    /**
     * Recebe atividades fixas e flexíveis e chama o Use Case para gerar e salvar a rotina.
     */
    async generateUserRoutine(req, res) {
        try {
            const { fixedActivities, flexibleActivities, userId } = req.body;
            if (!fixedActivities && !flexibleActivities) {
                res.status(400).json({ error: 'É necessário fornecer ao menos uma lista de atividades.' });
                return;
            }
            if (!userId) {
                res.status(400).json({ error: 'userId é obrigatório para salvar a rotina.' });
                return;
            }
            const routineResponse = await this.generateRoutineUseCase.execute(fixedActivities || [], flexibleActivities || []);
            // mudar lógica de título da rotina para que se tiver antes de 12 horas, use a data de hoje e depois disso usar a data de amanhã
            // Isso garante que a rotina seja sempre salva com um título coerente.
            const routineTitle = new Date().getHours() < 12
                ? `Rotina do dia ${new Date().toLocaleDateString('pt-BR')}`
                : `Rotina do dia ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`;
            await this.routineRepo.save({
                user_id: userId,
                title: routineTitle,
                content: routineResponse
            });
            res.json({ response: routineResponse });
        }
        catch (error) {
            console.error("Erro ao gerar e salvar rotina:", error);
            res.status(500).json({ error: 'Erro interno ao gerar a rotina.' });
        }
    }
}
exports.TestController = TestController;
