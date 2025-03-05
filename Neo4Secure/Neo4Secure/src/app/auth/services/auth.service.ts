import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  role: string;
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth'; // Ajusta la URL a la de tu backend

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    // El backend espera { user, password }
    const body = { user: username, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body);
  }
}
