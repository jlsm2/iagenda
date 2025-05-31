import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

interface Activity {
  name: string;
  startTime: string;
  endTime: string;
}

const MODEL_NAME = "gemini-1.5-flash-latest";

export class GenerateRoutineUseCase {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GenerateRoutineUseCase: Chave da API do Gemini não encontrada.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "CHAVE_API_AUSENTE_ROUTINE_UC");
  }

  private formatActivitiesForPrompt(activities: Activity[]): string {
    if (!activities || activities.length === 0) {
      return "Nenhuma atividade fornecida.";
    }
    let promptPart = "Por favor, crie uma sugestão de rotina diária organizada e produtiva, incorporando as seguintes atividades fixas nos horários especificados:\n";
    activities.forEach(activity => {
      promptPart += `- Atividade: "${activity.name}", Início: ${activity.startTime}, Término: ${activity.endTime}\n`;
    });
    promptPart += "\nA rotina deve ser realista e organizada por horários. Inclua pausas, horários de refeições e distribua as atividades de forma equilibrada ao longo do dia. Não sobrecarregue a agenda. Escreva a rotina como uma lista com horários e atividades, sem observações, negrito nem nada. APENAS os horários e as tarefas de maneira objetiva. Coloque os horários com o horário de início e o de término da atividade, com pausas.";
    return promptPart;
  }

  async execute(activities: Activity[]): Promise<string> {

    if (!activities || activities.length === 0) {
      return "Por favor, forneça ao menos uma atividade para gerar a rotina.";
    }

    const prompt = this.formatActivitiesForPrompt(activities);

    const model = this.genAI.getGenerativeModel({
    model: MODEL_NAME,
    safetySettings: [ // Configurações de segurança (ajuste conforme necessário)
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  }
}