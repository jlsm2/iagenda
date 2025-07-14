import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiResponse {
  response: string;
}

export interface UnifiedRoutinePayload {
  fixedActivities: { name: string; startTime: string; endTime: string; }[];
  flexibleActivities: { name: string; duration: number; }[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateRoutine(payload: UnifiedRoutinePayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/generate-routine`, payload);
  }

  // NOVOS MÉTODOS
  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }
}
