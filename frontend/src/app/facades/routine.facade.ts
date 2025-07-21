import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ApiService, UnifiedRoutinePayload, Routine } from '../services/api-service'; // Importar Routine

export interface FixedActivityPayload { name: string; startTime: string; endTime: string; }
export interface FlexibleActivityPayload { name: string; duration: number; }

@Injectable({
  providedIn: 'root'
})
export class RoutineFacade {
  // ALTERADO: Agora armazena o objeto Routine completo, não apenas o texto.
  private _generatedRoutine$ = new BehaviorSubject<Routine | null>(null);
  readonly generatedRoutine$: Observable<Routine | null> = this._generatedRoutine$.asObservable();

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
      // ALTERADO: Recebe e armazena o objeto Routine completo
      tap((newRoutine: Routine) => {
        this._generatedRoutine$.next(newRoutine);
        this.router.navigate(['/rotina']);
      }),
      catchError((error) => {
        const errorMsg = error.error?.error || 'Falha ao gerar a rotina.';
        this._processingError$.next(errorMsg);
        return of(null);
      }),
      finalize(() => this._isProcessing$.next(false))
    ).subscribe();
  }
  
  // NOVO: Método para lidar com a atualização do status
  updateCheckedStatus(activities: { titulo: string; realizada: boolean }[]): void {
    const currentRoutine = this._generatedRoutine$.getValue();
    if (!currentRoutine) return;

    // Cria um mapa de status a partir do array de atividades do componente
    const checkedMap: { [key: string]: boolean } = {};
    activities.forEach(act => {
      checkedMap[act.titulo] = act.realizada;
    });

    // Converte o mapa para uma string JSON
    const checkedActivitiesJson = JSON.stringify(checkedMap);

    this.apiService.updateRoutineStatus(currentRoutine.id, checkedActivitiesJson).pipe(
      tap((updatedRoutine: Routine) => {
        // Atualiza o estado no facade com os dados retornados do backend
        this._generatedRoutine$.next(updatedRoutine);
      }),
      catchError((error) => {
        console.error('Erro ao atualizar status da rotina:', error);
        // Opcional: Reverter a mudança visual se a API falhar
        return of(null);
      })
    ).subscribe();
  }

  loadUserRoutines(): void {
    const userId = this.getUserId();
    if (!userId) {
      this._userRoutines$.next([]);
      return;
    }

    this.apiService.getUserRoutines(userId).pipe(
      tap((routines: any[]) => this._userRoutines$.next(routines)),
      catchError((error) => {
        console.error('Erro ao carregar rotinas:', error);
        this._userRoutines$.next([]);
        return of([]);
      })
    ).subscribe();
  }

  loadRoutineById(id: number): void {
    this.apiService.getRoutineById(id).pipe(
      // ALTERADO: Recebe e armazena o objeto Routine completo
      tap((routine: Routine) => {
        this._generatedRoutine$.next(routine);
        this.router.navigate(['/rotina']);
      }),
      catchError((error) => {
        console.error('Erro ao carregar rotina:', error);
        return of(null);
      })
    ).subscribe();
  }

  deleteRoutine(id: number, updateLocal = false): void {
    this.apiService.deleteRoutine(id).pipe(
      tap(() => {
        if (updateLocal) {
          // Remove rotina da lista local sem recarregar tudo
          const current = this._userRoutines$.getValue();
          const updated = current.filter(routine => routine.id !== id);
          this._userRoutines$.next(updated);
        } else {
          // Ou recarrega toda a lista se preferir
          this.loadUserRoutines();
        }
      }),
      catchError((error) => {
        console.error('Erro ao excluir rotina:', error);
        return of(null);
      })
    ).subscribe();
  }
  
  
  
}