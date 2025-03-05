import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICuenta } from '../interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountCrudService {
  private apiUrl = 'http://localhost:8080/api/v1/account';

  constructor(private http: HttpClient) {}

  // Headers con el token si tu backend requiere autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listAccountsByUser(id_usuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${id_usuario}`, { headers: this.getAuthHeaders() });
  }


  listAccounts(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  fetchAccountById(id_cuenta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id_cuenta}`, { headers: this.getAuthHeaders() });
  }

  createAccount(account: Partial<ICuenta>): Observable<any> {
    return this.http.post<any>(this.apiUrl, account, { headers: this.getAuthHeaders() });
  }

  updateAccount(id_cuenta: string, account: Partial<ICuenta>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_cuenta}`, account, { headers: this.getAuthHeaders() });
  }

  deleteAccount(id_cuenta: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id_cuenta}`, { headers: this.getAuthHeaders() });
  }

  // Opcionales: lock_account, freeze_account, unlock_account
  lockAccount(id_cuenta: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_cuenta}/lock`, {}, { headers: this.getAuthHeaders() });
  }

  freezeAccount(id_cuenta: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_cuenta}/freeze`, {}, { headers: this.getAuthHeaders() });
  }

  unlockAccount(id_cuenta: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_cuenta}/unlock`, {}, { headers: this.getAuthHeaders() });
  }

}
