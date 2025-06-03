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
}

interface ActivityPayload {
  name: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-test-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-display.component.html',
  styleUrls: ['./test-display.component.scss']
})
export class TestDisplayComponent {
  activities: Activity[] = [];
  private nextId = 0; // contador para IDs únicos

  generatedRoutine$: Observable<string | null>;
  isProcessing$: Observable<boolean>;
  processingError$: Observable<string | null>;

  constructor(private testFacade: TestFacade) {
    this.generatedRoutine$ = this.testFacade.apiResponseMessage$; // a resposta da API será a rotina
    this.isProcessing$ = this.testFacade.isProcessing$;
    this.processingError$ = this.testFacade.processingError$;
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
    // validação básica no frontend antes de enviar
    const validActivities = this.activities.filter(
      act => act.name.trim() !== '' && act.startTime.trim() !== '' && act.endTime.trim() !== ''
    );

    const activityPayloads: ActivityPayload[] = validActivities.map(act => ({
        name: act.name,
        startTime: act.startTime,
        endTime: act.endTime
    }));

    this.testFacade.submitActivitiesForRoutine(activityPayloads);
  }

  trackActivityById(index: number, activity: Activity): number {
    return activity.id;
  }
}