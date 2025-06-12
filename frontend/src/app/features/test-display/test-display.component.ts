import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FixedActivitiesFacade } from '../../facades/fixed-activities'; // Importa o facade correto
import { CampoAtividadesFlexiveisComponent } from '../campo-atividades-flexiveis/campo-atividades-flexiveis.component';

// Interface para o estado local deste componente
interface Activity {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

// Interface para o payload que o facade espera
interface FixedActivityPayload {
  name: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-test-display',
  standalone: true,
  imports: [CommonModule, FormsModule, CampoAtividadesFlexiveisComponent],
  templateUrl: './test-display.component.html',
  styleUrls: ['./test-display.component.scss']
})
export class TestDisplayComponent {
  activities: Activity[] = [];
  private nextId = 0;

  generatedRoutine$: Observable<string | null>;
  isProcessing$: Observable<boolean>;
  processingError$: Observable<string | null>;

  constructor(private fixedActivitiesFacade: FixedActivitiesFacade) { // Injeta o facade correto
    // Observa os observables do facade de atividades fixas
    this.generatedRoutine$ = this.fixedActivitiesFacade.generatedRoutine$;
    this.isProcessing$ = this.fixedActivitiesFacade.isProcessing$;
    this.processingError$ = this.fixedActivitiesFacade.processingError$;
    
    this.addActivity();
  }

  addActivity(): void {
    this.activities.push({ id: this.nextId++, name: '', startTime: '', endTime: '' });
  }

  removeActivity(idToRemove: number): void {
    this.activities = this.activities.filter(activity => activity.id !== idToRemove);
    if (this.activities.length === 0) {
      this.addActivity();
    }
  }

  generateRoutine(): void {
    const validActivities = this.activities.filter(
      act => act.name.trim() !== '' && act.startTime.trim() !== '' && act.endTime.trim() !== ''
    );

    const activityPayloads: FixedActivityPayload[] = validActivities.map(act => ({
        name: act.name,
        startTime: act.startTime,
        endTime: act.endTime
    }));

    if (activityPayloads.length === 0) {
      alert('Por favor, adicione pelo menos uma atividade fixa com nome e horários válidos.');
      return;
    }

    // Chama o método do facade correto
    this.fixedActivitiesFacade.submitFixedActivities(activityPayloads);
  }

  trackActivityById(index: number, activity: Activity): number {
    return activity.id;
  }
}
