import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // <-- 1. IMPORTAR O ROUTER
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

  // 2. INJETAR O ROUTER NO CONSTRUTOR
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

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
        // Guarda a resposta da IA no nosso estado
        this._generatedRoutine$.next(apiResponse.response);
        // 3. APÓS O SUCESSO, NAVEGA PARA A PÁGINA /rotina
        this.router.navigate(['/rotina']);
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
