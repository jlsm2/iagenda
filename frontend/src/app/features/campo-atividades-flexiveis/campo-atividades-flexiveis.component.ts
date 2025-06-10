import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestFacade } from '../../facades/test-facade';

interface Activity {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  duration: number; // duração da atividade em minutos
}

interface ActivityPayload {
  name: string;
  startTime: string;
  endTime: string;
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
  private nextId = 0; // contador para IDs únicos

  generatedRoutine$: Observable<string | null>;
  isProcessing$: Observable<boolean>;
  processingError$: Observable<string | null>;

  constructor(private testFacade: TestFacade) {
    this.generatedRoutine$ = this.testFacade.apiResponseMessage$; // resposta da API
    this.isProcessing$ = this.testFacade.isProcessing$;
    this.processingError$ = this.testFacade.processingError$;
    this.addActivity();
  }

  addActivity(): void {
    this.activities.push({
      id: this.nextId++,
      name: '',
      startTime: '',
      endTime: '',
      duration: 30 // duração padrão de 30 minutos
    });
  }

  removeActivity(idToRemove: number): void {
    this.activities = this.activities.filter(activity => activity.id !== idToRemove);
    if (this.activities.length === 0) {
      this.addActivity();
    }
  }

  generateRoutine(): void {
    // validação básica antes de enviar
    const validActivities = this.activities.filter(
      act => act.name.trim() !== '' &&
             act.startTime.trim() !== '' &&
             act.endTime.trim() !== '' &&
             act.duration > 0
    );

    const activityPayloads: ActivityPayload[] = validActivities.map(act => ({
      name: act.name,
      startTime: act.startTime,
      endTime: act.endTime,
      duration: act.duration
    }));

    this.testFacade.submitActivitiesForRoutine(activityPayloads);
  }

  trackActivityById(index: number, activity: Activity): number {
    return activity.id;
  }
}
