import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoutineFacade } from '../../../facades/routine.facade';

// A interface que o seu template HTML espera
export interface Atividade {
  titulo: string;
  horario: string;
  emoji: string;
  realizada: boolean;
  cor: string;
  corFundo: string;
}

@Component({
  selector: 'app-daily-routine',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-routine.component.html',
  styleUrls: ['./daily-routine.component.scss']
})
export class DailyRoutineComponent implements OnInit {
  // O observable agora será do tipo Atividade[]
  atividades$: Observable<Atividade[] | null>;

  constructor(private routineFacade: RoutineFacade) {
    // Usamos o operador 'map' para transformar o texto bruto em um array de atividades
    this.atividades$ = this.routineFacade.generatedRoutine$.pipe(
      map(routineText => {
        if (!routineText) {
          return null; // Se não houver texto, retorna nulo
        }
        // Se houver texto, chama nossa função de parsing
        return this.parseRoutineTextToAtividades(routineText);
      })
    );
  }

  ngOnInit(): void {
    // Opcional: Log para depuração no console do navegador
    this.atividades$.subscribe(atividades => {
      console.log("Atividades processadas e prontas para exibição:", atividades);
    });
  }

  /**
   * Função principal que transforma o texto bruto da IA em um array de objetos Atividade.
   */
// DENTRO DA CLASSE DailyRoutineComponent, SUBSTITUA ESTE MÉTODO:

private parseRoutineTextToAtividades(text: string): Atividade[] {
  const atividades: Atividade[] = [];
  // Quebra o texto em linhas, ignorando linhas vazias
  const lines = text.split('\n').filter(line => line.trim() !== '');

  for (const line of lines) {
    // --- CORREÇÃO FINAL AQUI ---
    // Esta nova expressão regular é a definitiva. Ela entende os dois formatos de horário
    // e captura corretamente apenas o horário de início e o título completo.
    // O [–-] lida com diferentes tipos de traço que a API pode retornar.
    const match = line.match(/^(\d{2}:\d{2})\s*(?:[–-]\s*\d{2}:\d{2})?:\s*(.*)$/);

    if (match) {
      // match[1] será sempre o horário de início (ex: "07:00")
      // match[2] será sempre o título da atividade (ex: "Café da manhã")
      const [, startTime, titulo] = match;
      const horario = startTime.trim(); // Usamos apenas o horário de início para exibição

      const { emoji, cor, corFundo } = this.getVisualsForActivity(titulo);

      atividades.push({
        titulo: titulo.trim(),
        horario,
        emoji,
        realizada: false,
        cor,
        corFundo,
      });
    } else {
      // Adicionado para depuração: se uma linha não corresponder, saberemos qual é.
      console.warn('Linha da rotina não correspondeu ao formato esperado:', line);
    }
  }
  return atividades;
}


  /**
   * Função auxiliar para atribuir emojis e cores com base em palavras-chave.
   */
  private getVisualsForActivity(titulo: string): { emoji: string; cor: string; corFundo: string } {
    const lowerCaseTitle = titulo.toLowerCase();
    if (lowerCaseTitle.includes('acordar') || lowerCaseTitle.includes('dormir') || lowerCaseTitle.includes('higiene')) {
      return { emoji: '🛏️', cor: '#a384e0', corFundo: '#f3eefc' };
    }
    if (lowerCaseTitle.includes('café') || lowerCaseTitle.includes('almoçar') || lowerCaseTitle.includes('jantar') || lowerCaseTitle.includes('refeição')) {
      return { emoji: '🍽️', cor: '#89d19f', corFundo: '#eef9f2' };
    }
    if (lowerCaseTitle.includes('academia') || lowerCaseTitle.includes('exercício') || lowerCaseTitle.includes('correr')) {
      return { emoji: '🏋️', cor: '#83bde5', corFundo: '#eef6fb' };
    }
    if (lowerCaseTitle.includes('trabalho') || lowerCaseTitle.includes('reunião')) {
      return { emoji: '💼', cor: '#e58383', corFundo: '#fbeeee' };
    }
    if (lowerCaseTitle.includes('estudar') || lowerCaseTitle.includes('ler') || lowerCaseTitle.includes('projeto')) {
      return { emoji: '📚', cor: '#e5c083', corFundo: '#fbf6ee' };
    }
    if (lowerCaseTitle.includes('banho')) {
      return { emoji: '🚿', cor: '#89d19f', corFundo: '#eef9f2' };
    }
    if (lowerCaseTitle.includes('faculdade') || lowerCaseTitle.includes('aula')) {
      return { emoji: '🎓', cor: '#a384e0', corFundo: '#f3eefc' };
    }
    // Padrão para atividades não reconhecidas (como "Pausa" ou "Tempo livre")
    return { emoji: '✨', cor: '#a0a0a0', corFundo: '#f5f5f5' };
  }

  // A lógica para o checkmark permanece, mas agora ela modifica o estado do item na lista processada
  toggleStatus(atividade: Atividade): void {
    atividade.realizada = !atividade.realizada;
  }
}
