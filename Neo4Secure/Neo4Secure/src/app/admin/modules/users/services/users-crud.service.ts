import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsuario } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {
  // URL base para el CRUD de usuarios, ajusta según tu backend
  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) {}

  // Método para obtener los headers con el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Lista usuarios con parámetros opcionales para paginación y ordenamiento.
   * Aunque el backend actual no implemente estos parámetros, se incluyen para
   * mantener la estructura y facilitar futuras mejoras.
   */
  listUsers(limit: number, offset: number, orderBy: string): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('orderBy', orderBy);

    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders(), params });
  }

  /**
   * Obtiene un usuario por su ID.
   */
  fetchUserById(id_usuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id_usuario}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Crea un nuevo usuario.
   */
  createUser(user: Partial<IUsuario>): Observable<any> {
    
    return this.http.post<any>(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  /**
   * Actualiza un usuario existente.
   */
  updateUser(id_usuario: string, user: Partial<IUsuario>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_usuario}`, user, { headers: this.getAuthHeaders() });
  }

  /**
   * Elimina un usuario por su ID.
   */
  deleteUser(id_usuario: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id_usuario}`, { headers: this.getAuthHeaders() });
  }
}
