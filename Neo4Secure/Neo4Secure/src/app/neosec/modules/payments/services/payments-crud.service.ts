import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentCrudService {
  // Rutas base
  private transactionApiUrl = 'http://localhost:8080/api/v1/transaction';
  private accountApiUrl = 'http://localhost:8080/api/v1/account';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtiene las cuentas del usuario (usando el endpoint GET /api/v1/account/user/:id_usuario)
  listAccountsByUser(id_usuario: string): Observable<any> {
    return this.http.get<any>(`${this.accountApiUrl}/user/${id_usuario}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Crea una transacción (POST /api/v1/transaction)
  createTransaction(transactionData: any): Observable<any> {
    return this.http.post<any>(this.transactionApiUrl, transactionData, {
      headers: this.getAuthHeaders()
    });
  }
}
