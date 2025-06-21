import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ApiService, ApiResponse, UnifiedRoutinePayload } from '../services/api-service';

export interface FixedActivityPayload { name: string; startTime: string; endTime: string; }
export interface FlexibleActivityPayload { name: string; duration: number; }

@Injectable({
  providedIn: 'root'
})
export class RoutineFacade {
  private _generatedRoutine$ = new BehaviorSubject<string | null>(null);
  readonly generatedRoutine$: Observable<string | null> = this._generatedRoutine$.asObservable();

  private _isProcessing$ = new BehaviorSubject<boolean>(false);
  readonly isProcessing$: Observable<boolean> = this._isProcessing$.asObservable();

  private _processingError$ = new BehaviorSubject<string | null>(null);
  readonly processingError$: Observable<string | null> = this._processingError$.asObservable();

  constructor(private apiService: ApiService) {}

  generateUnifiedRoutine(fixed: FixedActivityPayload[], flexible: FlexibleActivityPayload[]): void {
    this._isProcessing$.next(true);
    this._processingError$.next(null);
    this._generatedRoutine$.next(null);

    const payload: UnifiedRoutinePayload = {
      fixedActivities: fixed,
      flexibleActivities: flexible
    };

    this.apiService.generateRoutine(payload).pipe(
      tap((apiResponse: ApiResponse) => {
        this._generatedRoutine$.next(apiResponse.response);
      }),
      catchError((error) => {
        const errorMsg = error.error?.error || 'Falha ao gerar a rotina.';
        this._processingError$.next(errorMsg);
        this._generatedRoutine$.next(null);
        return of(null);
      }),
      finalize(() => this._isProcessing$.next(false))
    ).subscribe();
  }
}