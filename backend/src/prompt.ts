export interface FixedActivity {
  name: string;
  startTime: string;
  endTime: string;
}
export interface FlexibleActivity {
  name: string;
  duration: number;
}

// Factory Design Pattern for ActivitiesPrompt
export class ActivitiesPrompt {
  private fixedActivities: FixedActivity[] = [];
  private flexibleActivities: FlexibleActivity[] = [];

  addFixedActivity(activity: FixedActivity[]): this {
    if (!this.fixedActivities) {
      this.fixedActivities = [];
    }
    this.fixedActivities.push(...activity);
    return this;
  }

  addFlexibleActivity(activity: FlexibleActivity[]): this {
    if (!this.flexibleActivities) {
      this.flexibleActivities = [];
    }
    this.flexibleActivities.push(...activity);
    return this;
  }

  build(): string {
    let promptPart =
      'Você é um assistente especialista em criar rotinas diárias otimizadas. Sua tarefa é criar uma agenda detalhada e realista baseada nas informações a seguir.\n\n';

    promptPart += '== ATIVIDADES FIXAS (OBRIGATÓRIAS) ==\n';
    promptPart +=
      'Estes são compromissos com horários definidos que NÃO PODEM ser alterados ou movidos.\n';
    if (this.fixedActivities && this.fixedActivities.length > 0) {
      this.fixedActivities.forEach((activity) => {
        promptPart += `- ${activity.name}: das ${activity.startTime} às ${activity.endTime}.\n`;
      });
    } else {
      promptPart += '- Nenhuma atividade fixa informada.\n';
    }
    promptPart += '\n';

    promptPart += '== ATIVIDADES FLEXÍVEIS (PARA ENCAIXAR) ==\n';
    promptPart +=
      'Estas tarefas devem ser encaixadas nos horários livres disponíveis ao longo do dia. Lembre de se atentar à duração informada, cumpra ela rigorosamente.\n';
    if (this.flexibleActivities && this.flexibleActivities.length > 0) {
      this.flexibleActivities.forEach((activity) => {
        promptPart += `- ${activity.name}: com duração exata de ${activity.duration} minutos.\n`;
      });
    } else {
      promptPart += '- Nenhuma atividade flexível informada.\n';
    }
    promptPart += '\n';

    // Instruções finais para a IA
    promptPart += 'Regras para a rotina final:\n';
    promptPart +=
      '1. Inclua horários para refeições (café da manhã, almoço, jantar) e pausas curtas entre as atividades.\n';
    promptPart +=
      "2. A resposta deve ser APENAS a lista da rotina, com horários de início e fim para cada item (ex: '08:00 - 08:30: Café da manhã').\n";
    promptPart +=
      '3. Não inclua observações, introduções, conclusões ou qualquer texto em negrito. Seja direto e objetivo.';

    return promptPart;
  }
}
