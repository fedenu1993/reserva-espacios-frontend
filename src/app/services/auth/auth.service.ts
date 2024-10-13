import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // URL de login en el backend

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/login', credentials).pipe(
      tap((response) => {
        // Almacenar el token en localStorage
        this.setToken(response.token);
      })
    );
  }

  logout(): void {
    const token = this.getToken();

    // Cerrar sesion
    this.http.post<any>(this.apiUrl + '/logout', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });

    // Eliminar el token al cerrar sesión
    localStorage.removeItem('token');
  }

  // Método para validar el token
  validateToken(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(`${this.apiUrl}/login/validate-token`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.error('Token inválido o no autorizado', error);
            this.logout();
            return of({ valid: false }); // Devuelve un objeto indicando que el token no es válido
          }
          // Manejo de otros errores
          return of({ valid: false });
        })
      );
  }

  // Método para verificar si está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.validateToken().pipe(
      map((response) => {
        return response.valid; // Devuelve true o false según la validación
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): Observable<User> {
    const token = localStorage.getItem('token');

    return this.http
      .get<any>(`${this.apiUrl}/login/user`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        map((response) => {
          return response.user;
        }) // Extrae el user
      );
  }
}
