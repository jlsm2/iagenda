"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
class TestController {
    constructor(processMessageUseCase, generateRoutineUseCase) {
        this.processMessageUseCase = processMessageUseCase;
        this.generateRoutineUseCase = generateRoutineUseCase;
    }
    async processUserMessage(req, res) { }
    // Novo método para gerar rotina
    async generateUserRoutine(req, res) {
        const activities = req.body.activities;
        if (!activities || !Array.isArray(activities) || activities.length === 0) {
            res.status(400).json({ error: 'Nenhuma atividade fornecida ou formato inválido. Envie um JSON como {"activities": [ ...lista de atividades... ]}' });
            return;
        }
        const routineResponse = await this.generateRoutineUseCase.execute(activities);
        res.json({ response: routineResponse });
    }
}
exports.TestController = TestController;
