import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoutineFacade, FixedActivityPayload, FlexibleActivityPayload } from '../facades/routine.facade'; // Importa o novo facade unificado

// Interfaces para o estado local do componente (com 'id' para rastreamento)
interface FixedActivity extends FixedActivityPayload {
  id: number;
}

interface FlexibleActivity extends FlexibleActivityPayload {
  id: number;
}

@Component({
  selector: 'app-routine-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './routine-planner.component.html',
  styleUrls: ['./routine-planner.component.scss']
})
export class RoutinePlannerComponent {
  // Listas de atividades para a UI
  fixedActivities: FixedActivity[] = [];
  flexibleActivities: FlexibleActivity[] = [];
  private nextFixedId = 0;
  private nextFlexibleId = 0;

  // Observables para conectar com o estado do facade
  generatedRoutine$: Observable<string | null>;
  isProcessing$: Observable<boolean>;
  processingError$: Observable<string | null>;

  constructor(private routineFacade: RoutineFacade) {
    this.generatedRoutine$ = this.routineFacade.generatedRoutine$;
    this.isProcessing$ = this.routineFacade.isProcessing$;
    this.processingError$ = this.routineFacade.processingError$;

    // Inicia com um campo de cada tipo
    this.addFixedActivity();
    this.addFlexibleActivity();
  }

  // --- Métodos para Atividades Fixas ---
  addFixedActivity(): void {
    this.fixedActivities.push({ id: this.nextFixedId++, name: '', startTime: '', endTime: '' });
  }
  removeFixedActivity(id: number): void {
    this.fixedActivities = this.fixedActivities.filter(act => act.id !== id);
  }

  // --- Métodos para Atividades Flexíveis ---
  addFlexibleActivity(): void {
    this.flexibleActivities.push({ id: this.nextFlexibleId++, name: '', duration: 30 });
  }
  removeFlexibleActivity(id: number): void {
    this.flexibleActivities = this.flexibleActivities.filter(act => act.id !== id);
  }

  /**
   * Método principal chamado pelo único botão "Gerar Rotina".
   */
  generateUnifiedRoutine(): void {
    // Valida e filtra apenas as atividades preenchidas
    const validFixedActivities: FixedActivityPayload[] = this.fixedActivities
      .filter(act => act.name && act.startTime && act.endTime)
      .map(({ id, ...rest }) => rest); // Remove o 'id' antes de enviar

    const validFlexibleActivities: FlexibleActivityPayload[] = this.flexibleActivities
      .filter(act => act.name && act.duration > 0)
      .map(({ id, ...rest }) => rest); // Remove o 'id' antes de enviar

    if (validFixedActivities.length === 0 && validFlexibleActivities.length === 0) {
      alert('Adicione pelo menos uma atividade para gerar a rotina.');
      return;
    }

    // Chama o método do facade unificado
    this.routineFacade.generateUnifiedRoutine(validFixedActivities, validFlexibleActivities);
  }

  // Métodos trackBy para otimização do *ngFor
  trackById(index: number, item: { id: number }): number {
    return item.id;
  }
}