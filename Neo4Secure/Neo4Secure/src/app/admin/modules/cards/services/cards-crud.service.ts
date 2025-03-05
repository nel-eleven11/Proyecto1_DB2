import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardCrudService {
  private apiUrl = 'http://localhost:8080/api/v1/card';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Listar todas las tarjetas asociadas a una cuenta
   * GET /api/v1/card/account/:id_cuenta
   */
  listCardsByAccount(id_cuenta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/account/${id_cuenta}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtener una tarjeta por su id
   * GET /api/v1/card/:id_tarjeta
   */
  fetchCardById(id_tarjeta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id_tarjeta}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Crear una nueva tarjeta
   * POST /api/v1/card
   */
  createCard(body: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, body, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Actualizar una tarjeta existente
   * PUT /api/v1/card/:id_tarjeta
   */
  updateCard(id_tarjeta: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_tarjeta}`, body, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Eliminar una tarjeta
   * DELETE /api/v1/card/:id_tarjeta
   */
  deleteCard(id_tarjeta: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id_tarjeta}`, {
      headers: this.getAuthHeaders()
    });
  }
}
