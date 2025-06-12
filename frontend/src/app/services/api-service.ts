// ARQUIVO: frontend/src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ActivityPayload {
  name: string;
  startTime: string;
  endTime: string;
}

export interface ApiResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  sendMessage(userMessage: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/send-message`, { message: userMessage });
  }

  generateRoutine(payload: { type: string, activities: ActivityPayload[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/generate-routine`, payload);
  }
}