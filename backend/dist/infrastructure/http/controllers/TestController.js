"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
class TestController {
    constructor(getTestDataUseCase) {
        this.getTestDataUseCase = getTestDataUseCase;
    }
    getTestData(req, res) {
        try {
            const data = this.getTestDataUseCase.execute();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar dados.' });
        }
    }
}
exports.TestController = TestController;
