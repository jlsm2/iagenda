import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../services/api-service';

interface ActivityPayload {
  name: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestFacade {
  private _apiResponseMessage$ = new BehaviorSubject<string | null>(null);
  readonly apiResponseMessage$: Observable<string | null> = this._apiResponseMessage$.asObservable();

  private _isProcessing$ = new BehaviorSubject<boolean>(false);
  readonly isProcessing$: Observable<boolean> = this._isProcessing$.asObservable();

  private _processingError$ = new BehaviorSubject<string | null>(null); 
  readonly processingError$: Observable<string | null> = this._processingError$.asObservable();

  constructor(private apiService: ApiService) {}

  sendMessageToChatApi(userMessage: string): void {
    this._isProcessing$.next(true);
    this._processingError$.next(null);
    this._apiResponseMessage$.next(null);

    this.apiService.sendMessage(userMessage).pipe(
      tap((apiResponse: ApiResponse) => this._apiResponseMessage$.next(apiResponse.response)),
      catchError((error) => {
        const errorMsg = typeof error.error === 'string' ? error.error : (error.error?.error || 'Falha ao enviar mensagem para o chat.');
        this._processingError$.next(errorMsg);
        this._apiResponseMessage$.next(null);
        return of(null);
      }),
      finalize(() => this._isProcessing$.next(false))
    ).subscribe();
  }

  submitActivitiesForRoutine(activities: ActivityPayload[]): void {
    this._isProcessing$.next(true);
    this._processingError$.next(null);
    this._apiResponseMessage$.next(null); // limpa resposta anterior (seja de chat ou rotina)

    this.apiService.generateRoutine(activities).pipe(
      tap((apiResponse: ApiResponse) => {
        this._apiResponseMessage$.next(apiResponse.response);
      }),
      catchError((error) => {
        console.error('Erro ao gerar rotina:', error);
        const errorMsg = typeof error.error === 'string' ? error.error : (error.error?.error || 'Falha ao gerar a rotina.');
        this._processingError$.next(errorMsg);
        this._apiResponseMessage$.next(null);
        return of(null);
      }),
      finalize(() => {
        this._isProcessing$.next(false);
      })
    ).subscribe();
  }
}