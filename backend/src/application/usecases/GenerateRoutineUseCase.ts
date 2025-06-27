import { GoogleGenerativeAI, GenerationConfig, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { InteractionRepository } from '../../infrastructure/repositories/InteractionRepository';

interface FixedActivity { name: string; startTime: string; endTime: string; }
interface FlexibleActivity { name: string; duration: number; }

const MODEL_NAME = "gemini-1.5-flash-latest";

export class GenerateRoutineUseCase {
  private genAI: GoogleGenerativeAI;
  private interactionRepository: InteractionRepository;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GenerateRoutineUseCase: Chave da API do Gemini não encontrada.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "CHAVE_API_AUSENTE");
    this.interactionRepository = new InteractionRepository();
  }

  private formatActivitiesForPrompt(fixed: FixedActivity[], flexible: FlexibleActivity[]): string {
    let promptPart = "Você é um assistente especialista em criar rotinas diárias otimizadas. Sua tarefa é criar uma agenda detalhada e realista baseada nas informações a seguir.\n\n";

    promptPart += "== ATIVIDADES FIXAS (OBRIGATÓRIAS) ==\n";
    promptPart += "Estes são compromissos com horários definidos que NÃO PODEM ser alterados ou movidos.\n";
    if (fixed && fixed.length > 0) {
      fixed.forEach(activity => {
        promptPart += `- ${activity.name}: das ${activity.startTime} às ${activity.endTime}.\n`;
      });
    } else {
      promptPart += "- Nenhuma atividade fixa informada.\n";
    }
    promptPart += "\n";

    promptPart += "== ATIVIDADES FLEXÍVEIS (PARA ENCAIXAR) ==\n";
    promptPart += "Estas tarefas devem ser encaixadas nos horários livres disponíveis ao longo do dia. Lembre de se atentar à duração informada, cumpra ela rigorosamente.\n";
    if (flexible && flexible.length > 0) {
      flexible.forEach(activity => {
        promptPart += `- ${activity.name}: com duração exata de ${activity.duration} minutos.\n`;
      });
    } else {
      promptPart += "- Nenhuma atividade flexível informada.\n";
    }
    promptPart += "\n";

    promptPart += "== REGRAS DE GERAÇÃO (MUITO IMPORTANTES) ==\n";
    promptPart += "1.  Pode dividir as atividades flexíveis se você achar mais conveniente\n";
    promptPart += "2.  **REFEIÇÕES**: Inclua Café da Manhã (preferencialmente entre 06:00 e 09:00), Almoço (preferencialmente entre 12:00 e 14:00) e Jantar (preferencialmente entre 18:00 e 21:00). A duração de cada refeição deve ser de 30 a 60 minutos.\n";
    promptPart += "3.  **PAUSAS**: Insira pausas curtas (10-15 minutos) entre atividades longas ou que exijam muita concentração.\n";
    promptPart += "4.  **ESTRUTURA DO DIA**: Lembre de colocar o começo do dia com higiene pessoal e terminar o dia com prepração para dormir. Escolha a hora de acordar e dormir com base no horário das atividades informadas, tentando fazer com que tenha uma boa noite de sono.\n";
    promptPart += "5.  **FORMATO DA RESPOSTA**: A resposta deve ser APENAS a lista da rotina. Cada linha deve seguir o formato 'HH:MM – HH:MM: Nome da Atividade'. Não inclua introduções, conclusões, observações, negrito, asteriscos ou qualquer texto que não seja a rotina em si.\n";
    promptPart += "6.  **CONFLITOS**: Se as atividades fixas se sobrepõem, aponte o conflito claramente em vez de gerar uma rotina inválida. Por fim, independente de qualquer coisa coloque as atividades obrigatórias nos horários delas.\n\n";
    promptPart += "== ROTINA GERADA: ==\n";

    return promptPart;
  }

  private summarizeUserActivities(fixed: FixedActivity[], flexible: FlexibleActivity[]): string {
    let summary = "FIXAS:\n";
    if (fixed && fixed.length > 0) {
      fixed.forEach(act => {
        summary += `- ${act.name}: ${act.startTime} às ${act.endTime}\n`;
      });
    } else {
      summary += "- Nenhuma\n";
    }

    summary += "FLEXÍVEIS:\n";
    if (flexible && flexible.length > 0) {
      flexible.forEach(act => {
        summary += `- ${act.name}: ${act.duration} min\n`;
      });
    } else {
      summary += "- Nenhuma\n";
    }

    return summary;
  }

  async execute(fixedActivities: FixedActivity[], flexibleActivities: FlexibleActivity[]): Promise<string> {
    if ((!fixedActivities || fixedActivities.length === 0) && (!flexibleActivities || flexibleActivities.length === 0)) {
      return "Por favor, forneça ao menos uma atividade (fixa ou flexível) para gerar a rotina.";
    }

    const prompt = this.formatActivitiesForPrompt(fixedActivities, flexibleActivities);
    const inputSummary = this.summarizeUserActivities(fixedActivities, flexibleActivities);

    const generationConfig: GenerationConfig = {
      temperature: 0.3,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    try {
      const model = this.genAI.getGenerativeModel({
        model: MODEL_NAME,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
        generationConfig,
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      await this.interactionRepository.save({
        prompt,
        response: text,
        success: true,
        input_summary: inputSummary,
      });

      return text;

    } catch (error) {
      const errorString = error instanceof Error ? error.message : JSON.stringify(error);

      await this.interactionRepository.save({
        prompt,
        error: errorString,
        success: false,
        input_summary: inputSummary,
      });

      console.error("Erro ao chamar a API do Gemini:", error);
      return "Desculpe, ocorreu um erro ao tentar gerar sua rotina com a API.";
    }
  }
}
