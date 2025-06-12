import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../services/api-service';

interface ActivityPayload {
  name: string;
  duration: number;
  startTime: string;
  endTime: string;
}

interface FlexibleActivityPayload {
  name: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlexibleActivitiesFacade {
  private _generatedRoutine$ = new BehaviorSubject<string | null>(null);
  readonly generatedRoutine$: Observable<string | null> = this._generatedRoutine$.asObservable();

  private _isProcessing$ = new BehaviorSubject<boolean>(false);
  readonly isProcessing$: Observable<boolean> = this._isProcessing$.asObservable();

  private _processingError$ = new BehaviorSubject<string | null>(null);
  readonly processingError$: Observable<string | null> = this._processingError$.asObservable();

  constructor(private apiService: ApiService) {}

  submitFlexibleActivities(activities: FlexibleActivityPayload[]): void {
    this._isProcessing$.next(true);
    this._processingError$.next(null);
    this._generatedRoutine$.next(null);

    const activitiesForApi: ActivityPayload[] = activities.map(act => ({
      name: act.name,
      duration: act.duration,
      startTime: '',
      endTime: ''
    }));

    const payload = { type: 'flexivel', activities: activitiesForApi };

    this.apiService.generateRoutine(payload).pipe(
      tap((apiResponse: ApiResponse) => {
        this._generatedRoutine$.next(apiResponse.response);
      }),
      catchError((error) => {
        console.error('Erro ao gerar rotina flexível:', error);
        const errorMsg = typeof error.error === 'string' ? error.error : (error.error?.error || 'Falha ao gerar a rotina com atividades flexíveis.');
        this._processingError$.next(errorMsg);
        return of(null);
      }),
      finalize(() => this._isProcessing$.next(false))
    ).subscribe();
  }
}
