import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// NOVO: Interface para a Rotina, espelhando o backend
export interface Routine {
  id: number;
  user_id: number;
  title: string;
  content: string;
  checked_activities: string; // JSON string
  created_at: Date;
}

export interface UnifiedRoutinePayload {
  userId: number;
  fixedActivities: { name: string; startTime: string; endTime: string; }[];
  flexibleActivities: { name: string; duration: number; }[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ALTERADO: A geração de rotina agora retorna o objeto Routine completo
  generateRoutine(payload: UnifiedRoutinePayload): Observable<Routine> {
    return this.http.post<Routine>(`${this.apiUrl}/generate-routine`, payload);
  }

  // NOVO: Método para enviar a atualização do status das atividades
  updateRoutineStatus(id: number, checkedActivities: string): Observable<Routine> {
    const payload = { checked_activities: checkedActivities };
    return this.http.patch<Routine>(`${this.apiUrl}/routines/${id}`, payload);
  }

  // --- MÉTODOS EXISTENTES (sem alterações) ---
  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  getUserRoutines(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/routines?user_id=${userId}`);
  }

  getRoutineById(routineId: number): Observable<Routine> { // ALTERADO: Tipo de retorno
    return this.http.get<Routine>(`${this.apiUrl}/routines/${routineId}`);
  }

  deleteRoutine(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/routines/${id}`);
  }
  
  
}