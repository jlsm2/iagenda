import {
  GoogleGenerativeAI,
  GenerationConfig,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { InteractionRepository } from '../../infrastructure/repositories/InteractionRepository';

import {
  ActivitiesPrompt,
  FixedActivity,
  FlexibleActivity,
} from '../../prompt';

const MODEL_NAME = 'gemini-1.5-flash-latest';

export class GenerateRoutineUseCase {
  private genAI: GoogleGenerativeAI;
  private interactionRepository: InteractionRepository;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error(
        'GenerateRoutineUseCase: Chave da API do Gemini não encontrada.'
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'CHAVE_API_AUSENTE');
    this.interactionRepository = new InteractionRepository();
  }

  private formatActivitiesForPrompt(
    fixed: FixedActivity[],
    flexible: FlexibleActivity[]
  ): string {
    return new ActivitiesPrompt()
      .addFixedActivity(fixed)
      .addFlexibleActivity(flexible)
      .build();
  }

  private summarizeUserActivities(
    fixed: FixedActivity[],
    flexible: FlexibleActivity[]
  ): string {
    let summary = 'FIXAS:\n';
    if (fixed && fixed.length > 0) {
      fixed.forEach((act) => {
        summary += `- ${act.name}: ${act.startTime} às ${act.endTime}\n`;
      });
    } else {
      summary += '- Nenhuma\n';
    }

    summary += 'FLEXÍVEIS:\n';
    if (flexible && flexible.length > 0) {
      flexible.forEach((act) => {
        summary += `- ${act.name}: ${act.duration} min\n`;
      });
    } else {
      summary += '- Nenhuma\n';
    }

    return summary;
  }

  async execute(
    fixedActivities: FixedActivity[],
    flexibleActivities: FlexibleActivity[]
  ): Promise<string> {
    if (
      (!fixedActivities || fixedActivities.length === 0) &&
      (!flexibleActivities || flexibleActivities.length === 0)
    ) {
      return 'Por favor, forneça ao menos uma atividade (fixa ou flexível) para gerar a rotina.';
    }

    const prompt = this.formatActivitiesForPrompt(
      fixedActivities,
      flexibleActivities
    );
    const inputSummary = this.summarizeUserActivities(
      fixedActivities,
      flexibleActivities
    );

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
      const errorString =
        error instanceof Error ? error.message : JSON.stringify(error);

      await this.interactionRepository.save({
        prompt,
        error: errorString,
        success: false,
        input_summary: inputSummary,
      });

      console.error('Erro ao chamar a API do Gemini:', error);
      return 'Desculpe, ocorreu um erro ao tentar gerar sua rotina com a API.';
    }
  }
}
