"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessMessageUseCase = void 0;
const generative_ai_1 = require("@google/generative-ai");
const MODEL_NAME = "gemini-1.5-flash-latest";
class ProcessMessageUseCase {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Chave da API do Gemini não encontrada. Verifique o arquivo .env e as configurações.");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || "CHAVE_API_AUSENTE_NO_CONSTRUTOR");
    }
    async execute(userMessage) {
        const model = this.genAI.getGenerativeModel({
            model: MODEL_NAME,
            safetySettings: [
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });
        const result = await model.generateContent(userMessage);
        const response = result.response;
        const text = response.text();
        return text;
    }
}
exports.ProcessMessageUseCase = ProcessMessageUseCase;
