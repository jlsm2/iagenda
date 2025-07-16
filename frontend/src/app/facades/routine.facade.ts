import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  private _userRoutines$ = new BehaviorSubject<any[]>([]);
  readonly userRoutines$ = this._userRoutines$.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  private getUserId(): number | null {
    const raw = localStorage.getItem('userId');
    return raw ? Number(raw) : null;
  }

  generateUnifiedRoutine(fixed: FixedActivityPayload[], flexible: FlexibleActivityPayload[]): void {
    this._isProcessing$.next(true);
    this._processingError$.next(null);
    this._generatedRoutine$.next(null);

    const userId = this.getUserId();
    if (!userId) {
      this._processingError$.next('Usuário não autenticado.');
      this._isProcessing$.next(false);
      return;
    }

    const payload: UnifiedRoutinePayload = {
      fixedActivities: fixed,
      flexibleActivities: flexible,
      userId: userId
    };

    this.apiService.generateRoutine(payload).pipe(
      tap((apiResponse: ApiResponse) => {
        this._generatedRoutine$.next(apiResponse.response);
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

  loadUserRoutines(): void {
    const userId = this.getUserId();
    if (!userId) {
      this._userRoutines$.next([]);
      return;
    }

    this.apiService.getUserRoutines(userId).pipe(
      tap((routines: any[]) => {
        this._userRoutines$.next(routines);
      }),
      catchError((error) => {
        console.error('Erro ao carregar rotinas:', error);
        this._userRoutines$.next([]);
        return of([]);
      })
    ).subscribe();
  }

  loadRoutineById(id: number): void {
    this.apiService.getRoutineById(id).pipe(
      tap((routine: any) => {
        this._generatedRoutine$.next(routine.content);
        this.router.navigate(['/rotina']);
      }),
      catchError((error) => {
        console.error('Erro ao carregar rotina:', error);
        return of(null);
      })
    ).subscribe();
  }
}
