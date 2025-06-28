"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
// Removido a interface Activity daqui, pois ela está definida nos Use Cases.
class TestController {
    constructor(processMessageUseCase, generateRoutineUseCase) {
        this.processMessageUseCase = processMessageUseCase;
        this.generateRoutineUseCase = generateRoutineUseCase;
    }
    async processUserMessage(req, res) {
        // Se quiser manter o chat, a lógica viria aqui. Por enquanto, pode deixar vazio.
    }
    /**
     * Recebe atividades fixas e flexíveis e chama o Use Case para gerar a rotina.
     */
    async generateUserRoutine(req, res) {
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
        }
        catch (error) {
            console.error("Erro ao gerar rotina no controller:", error);
            res.status(500).json({ error: 'Erro interno ao gerar a rotina.' });
        }
    }
}
exports.TestController = TestController;
