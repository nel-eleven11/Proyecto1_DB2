import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionCrudService {
  private apiUrl = 'http://localhost:8080/api/v1/transaction';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Lista las transacciones de una cuenta dada
   * GET /api/v1/transaction/account/:id_cuenta
   */
  listTransactionsByAccount(id_cuenta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/account/${id_cuenta}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Podrías agregar más métodos si lo deseas:
  // fetchTransactionById(id_transaccion: string) { ... }
  // createTransaction(body: any) { ... }
  // updateTransaction(id_transaccion: string, body: any) { ... }
  // deleteTransaction(id_transaccion: string) { ... }
}
