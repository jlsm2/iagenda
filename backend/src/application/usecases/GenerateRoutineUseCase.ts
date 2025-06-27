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

  /**
   * Cria um prompt detalhado para a IA, incluindo atividades fixas e flexíveis.
   * @param fixed A lista de atividades com horários fixos.
   * @param flexible A lista de atividades com durações flexíveis.
   * @returns A string de prompt completa a ser enviada para a IA.
   */
  private formatActivitiesForPrompt(fixed: FixedActivity[], flexible: FlexibleActivity[]): string {
    let promptPart = "Você é um assistente especialista em criar rotinas diárias otimizadas. Sua tarefa é criar uma agenda detalhada e realista baseada nas informações a seguir.\n\n";

    // Adiciona as atividades fixas, que são as restrições principais
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

    // Adiciona as atividades flexíveis, que devem ser encaixadas nos horários livres
    promptPart += "== ATIVIDADES FLEXÍVEIS (PARA ENCAIXAR) ==\n";
    promptPart += "Estas tarefas devem ser encaixadas nos horários livres disponíveis ao longo do dia, respeitando suas durações.\n";
    if (flexible && flexible.length > 0) {
      flexible.forEach(activity => {
        promptPart += `- ${activity.name}: com duração exata de ${activity.duration} minutos.\n`;
      });
    } else {
      promptPart += "- Nenhuma atividade flexível informada.\n";
    }
    promptPart += "\n";

    // Instruções finais e regras para a IA
    promptPart += "== REGRAS DE GERAÇÃO (MUITO IMPORTANTES) ==\n";
    promptPart += "1.  **NÃO DIVIDA AS ATIVIDADES FLEXÍVEIS**: Se uma atividade tem duração de 120 minutos, ela deve ser alocada em um único bloco de 2 horas contínuas.\n";
    promptPart += "2.  **REFEIÇÕES**: Inclua Café da Manhã (entre 06:00 e 09:00), Almoço (obrigatoriamente entre 12:00 e 14:00) e Jantar (entre 18:00 e 21:00). A duração de cada refeição deve ser de 30 a 60 minutos.\n";
    promptPart += "3.  **PAUSAS**: Insira pausas curtas (10-15 minutos) entre atividades longas ou que exijam muita concentração.\n";
    promptPart += "4.  **ESTRUTURA DO DIA**: Assuma que o dia começa às 06:00 com 'Acordar e higiene pessoal' e termina por volta das 22:30 com 'Preparação para dormir'.\n";
    promptPart += "5.  **FORMATO DA RESPOSTA**: A resposta deve ser APENAS a lista da rotina. Cada linha deve seguir o formato 'HH:MM – HH:MM: Nome da Atividade'. Não inclua introduções, conclusões, observações, negrito, asteriscos ou qualquer texto que não seja a rotina em si.\n";
    promptPart += "6.  **CONFLITOS**: Se as atividades fixas se sobrepõem, aponte o conflito claramente em vez de gerar uma rotina inválida.\n\n";
    promptPart += "== ROTINA GERADA: ==\n";

    return promptPart;
  }

  /**
   * Orquestra a geração da rotina: formata o prompt, chama a IA, salva a interação e retorna o resultado.
   * @param fixedActivities A lista de atividades fixas do usuário.
   * @param flexibleActivities A lista de atividades flexíveis do usuário.
   * @returns Uma string com a rotina gerada ou uma mensagem de erro.
   */
  async execute(fixedActivities: FixedActivity[], flexibleActivities: FlexibleActivity[]): Promise<string> {
    if ((!fixedActivities || fixedActivities.length === 0) && (!flexibleActivities || flexibleActivities.length === 0)) {
      return "Por favor, forneça ao menos uma atividade (fixa ou flexível) para gerar a rotina.";
    }

    const prompt = this.formatActivitiesForPrompt(fixedActivities, flexibleActivities);
    
    // Configurações para controlar o comportamento do modelo de IA
    const generationConfig: GenerationConfig = {
      temperature: 0.3, // Deixa a IA mais focada e menos "criativa"
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    try {
      const model = this.genAI.getGenerativeModel({
        model: MODEL_NAME,
        // Configurações de segurança para filtrar conteúdo inadequado
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
        generationConfig,
      });

      // Envia o prompt para a API do Gemini
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Salva o resultado de sucesso no banco de dados para o histórico
      await this.interactionRepository.save({
        prompt: prompt,
        response: text,
        success: true,
      });

      return text;

    } catch (error) {
      const errorString = error instanceof Error ? error.message : JSON.stringify(error);
      
      // Salva o resultado de falha no banco de dados para o histórico
      await this.interactionRepository.save({
        prompt: prompt,
        error: errorString,
        success: false,
      });
      
      console.error("Erro ao chamar a API do Gemini:", error);
      return "Desculpe, ocorreu um erro ao tentar gerar sua rotina com a API.";
    }
  }
}
