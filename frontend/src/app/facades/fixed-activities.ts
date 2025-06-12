import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../services/api-service';

interface FixedActivityPayload {
  name: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class FixedActivitiesFacade {
  private _generatedRoutine$ = new BehaviorSubject<string | null>(null);
  readonly generatedRoutine$: Observable<string | null> = this._generatedRoutine$.asObservable();

  private _isProcessing$ = new BehaviorSubject<boolean>(false);
  readonly isProcessing$: Observable<boolean> = this._isProcessing$.asObservable();

  private _processingError$ = new BehaviorSubject<string | null>(null);
  readonly processingError$: Observable<string | null> = this._processingError$.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Envia as atividades fixas para geração de rotina.
   * @param activities Lista de atividades fixas.
   */
  submitFixedActivities(activities: FixedActivityPayload[]): void {
    this._isProcessing$.next(true);
    this._processingError$.next(null);
    this._generatedRoutine$.next(null);

    // O payload enviado para a API contém o tipo 'fixa'
    const payload = { type: 'fixa', activities };

    this.apiService.generateRoutine(payload).pipe(
      tap((apiResponse: ApiResponse) => {
        this._generatedRoutine$.next(apiResponse.response);
      }),
      catchError((error) => {
        console.error('Erro ao gerar rotina fixa:', error);
        const errorMsg = typeof error.error === 'string' ? error.error : (error.error?.error || 'Falha ao gerar a rotina com atividades fixas.');
        this._processingError$.next(errorMsg);
        return of(null);
      }),
      finalize(() => this._isProcessing$.next(false))
    ).subscribe();
  }
}
