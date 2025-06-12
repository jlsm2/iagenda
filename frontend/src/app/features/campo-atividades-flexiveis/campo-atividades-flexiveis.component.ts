import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexibleActivitiesFacade } from '../../facades/flexible-activities'; // Importa o facade correto

// Interface para o estado local deste componente
interface Activity {
  id: number;
  name: string;
  duration: number;
}

// Interface para o payload que o facade espera
interface FlexibleActivityPayload {
  name: string;
  duration: number;
}

@Component({
  selector: 'app-campo-atividades-flexiveis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campo-atividades-flexiveis.component.html',
  styleUrls: ['./campo-atividades-flexiveis.component.scss']
})
export class CampoAtividadesFlexiveisComponent {
  activities: Activity[] = [];
  private nextId = 0;

  generatedRoutine$: Observable<string | null>;
  isProcessing$: Observable<boolean>;
  processingError$: Observable<string | null>;

  constructor(private flexibleActivitiesFacade: FlexibleActivitiesFacade) { // Injeta o facade correto
    // Observa os observables do facade de atividades flexíveis
    this.generatedRoutine$ = this.flexibleActivitiesFacade.generatedRoutine$;
    this.isProcessing$ = this.flexibleActivitiesFacade.isProcessing$;
    this.processingError$ = this.flexibleActivitiesFacade.processingError$;
    
    this.addActivity();
  }

  addActivity(): void {
    this.activities.push({
      id: this.nextId++,
      name: '',
      duration: 30
    });
  }

  removeActivity(idToRemove: number): void {
    this.activities = this.activities.filter(activity => activity.id !== idToRemove);
    if (this.activities.length === 0) {
      this.addActivity();
    }
  }

  generateFlexibleRoutine(): void {
    const validActivities = this.activities.filter(
      act => 
        act.name.trim() !== '' &&
        act.duration != null &&
        act.duration > 0
    );

    const activityPayloads: FlexibleActivityPayload[] = validActivities.map(act => ({
      name: act.name,
      duration: act.duration
    }));
    
    if (activityPayloads.length === 0) {
      alert('Por favor, adicione pelo menos uma atividade flexível com nome e duração válidos.');
      return;
    }

    // Chama o método do facade correto
    this.flexibleActivitiesFacade.submitFlexibleActivities(activityPayloads);
  }

  trackActivityById(index: number, activity: Activity): number {
    return activity.id;
  }
}
