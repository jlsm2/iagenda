import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Interfaces para os dois tipos de atividades
interface FixedActivity {
  name: string;
  startTime: string;
  endTime: string;
}

interface FlexibleActivity {
  name: string;
  duration: number; // em minutos
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

  /**
   * Cria um prompt detalhado para a IA, incluindo atividades fixas e flexíveis.
   */
  private formatActivitiesForPrompt(fixed: FixedActivity[], flexible: FlexibleActivity[]): string {
    let promptPart = "Por favor, crie uma sugestão de rotina diária detalhada e otimizada. A rotina deve ser realista, organizada por horários e equilibrada.\n\n";

    // Adiciona as atividades fixas, que são as restrições principais
    if (fixed && fixed.length > 0) {
      promptPart += "PRIMEIRO, considere estas ATIVIDADES FIXAS que são obrigatórias e não podem ter seus horários alterados:\n";
      fixed.forEach(activity => {
        promptPart += `- Atividade Fixa: "${activity.name}", das ${activity.startTime} às ${activity.endTime}.\n`;
      });
      promptPart += "\n";
    }

    // Adiciona as atividades flexíveis, que devem ser encaixadas nos horários livres
    if (flexible && flexible.length > 0) {
      promptPart += "AGORA, encaixe estas ATIVIDADES FLEXÍVEIS nos horários livres disponíveis ao longo do dia, respeitando suas durações:\n";
      flexible.forEach(activity => {
        promptPart += `- Atividade Flexível: "${activity.name}", com duração de ${activity.duration} minutos.\n`;
      });
      promptPart += "\n";
    }

    // Instruções finais para a IA
    promptPart += "Regras para a rotina final:\n";
    promptPart += "1. Inclua horários para refeições (café da manhã, almoço, jantar) e pausas curtas entre as atividades.\n";
    promptPart += "2. A resposta deve ser APENAS a lista da rotina, com horários de início e fim para cada item (ex: '08:00 - 08:30: Café da manhã').\n";
    promptPart += "3. Não inclua observações, introduções, conclusões ou qualquer texto em negrito. Seja direto e objetivo.";

    return promptPart;
  }

  /**
   * Executa a geração da rotina com base nas atividades fixas e flexíveis.
   */
  async execute(fixedActivities: FixedActivity[], flexibleActivities: FlexibleActivity[]): Promise<string> {
    if ((!fixedActivities || fixedActivities.length === 0) && (!flexibleActivities || flexibleActivities.length === 0)) {
      return "Por favor, forneça ao menos uma atividade (fixa ou flexível) para gerar a rotina.";
    }

    const prompt = this.formatActivitiesForPrompt(fixedActivities, flexibleActivities);
    console.log("PROMPT GERADO PARA A IA:\n", prompt); // Ótimo para depuração

    try {
      const model = this.genAI.getGenerativeModel({
        model: MODEL_NAME,
        safetySettings: [
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
    } catch (error) {
      console.error("Erro ao chamar a API do Gemini para gerar rotina:", error);
      return "Desculpe, ocorreu um erro ao tentar gerar sua rotina com a API.";
    }
  }
}