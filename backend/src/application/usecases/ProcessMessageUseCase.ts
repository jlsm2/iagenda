import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const MODEL_NAME = "gemini-1.5-flash-latest";

export class ProcessMessageUseCase {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Chave da API do Gemini não encontrada. Verifique o arquivo .env e as configurações.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "CHAVE_API_AUSENTE_NO_CONSTRUTOR");
  }

  async execute(userMessage: string): Promise<string> {

    const model = this.genAI.getGenerativeModel({
    model: MODEL_NAME,
    safetySettings: [
        {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ],
    });

    const result = await model.generateContent(userMessage);
    const response = result.response;
    const text = response.text();
    return text;

  }
}