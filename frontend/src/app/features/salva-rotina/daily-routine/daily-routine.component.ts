import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RoutineFacade } from '../../../facades/routine.facade';
import { Routine } from '../../../services/api-service';

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
export class DailyRoutineComponent implements OnInit, OnDestroy {
  atividades$: Observable<Atividade[] | null>;
  private allActivities: Atividade[] = []; // NOVO: para guardar a lista atual
  private destroy$ = new Subject<void>(); // NOVO: para gerenciar subscriptions

  constructor(private routineFacade: RoutineFacade) {
    // ALTERADO: O fluxo agora começa com o objeto Routine completo
    this.atividades$ = this.routineFacade.generatedRoutine$.pipe(
      map((routine: Routine | null) => {
        if (!routine || !routine.content) {
          return null;
        }
        const checkedMap = JSON.parse(routine.checked_activities || '{}');
        const parsedActivities = this.parseRoutineTextToAtividades(routine.content, checkedMap);
        
        this.allActivities = parsedActivities; // Armazena a lista
        
        return parsedActivities;
      })
    );
  }

  ngOnInit(): void {
    // Log para depuração
    this.atividades$.pipe(takeUntil(this.destroy$)).subscribe(atividades => {
      console.log("Atividades processadas e prontas para exibição:", atividades);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ALTERADO: O método de parsing agora considera o estado salvo
  private parseRoutineTextToAtividades(text: string, checkedMap: { [key: string]: boolean }): Atividade[] {
    const atividades: Atividade[] = [];
    const lines = text.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      const match = line.match(/^(\d{2}:\d{2})\s*(?:[–-]\s*\d{2}:\d{2})?:\s*(.*)$/);
      if (match) {
        const [, startTime, tituloRaw] = match;
        const titulo = tituloRaw.trim();
        const horario = startTime.trim();
        const { emoji, cor, corFundo } = this.getVisualsForActivity(titulo);

        atividades.push({
          titulo,
          horario,
          emoji,
          // Se o título existe no mapa, usa o valor, senão, `false`
          realizada: checkedMap[titulo] || false,
          cor,
          corFundo,
        });
      }
    }
    return atividades;
  }

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
    return { emoji: '✨', cor: '#a0a0a0', corFundo: '#f5f5f5' };
  }

  // ALTERADO: Agora a função chama o facade para persistir a mudança
  toggleStatus(atividade: Atividade): void {
    // 1. Atualiza o estado visual imediatamente para uma boa UX
    atividade.realizada = !atividade.realizada;

    // 2. Chama o facade para salvar o estado de TODAS as atividades
    this.routineFacade.updateCheckedStatus(this.allActivities);
  }
}