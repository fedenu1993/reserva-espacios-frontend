import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from 'src/app/models/espacio.model';

@Injectable({
  providedIn: 'root'
})
export class EspacioService {

  private apiUrl = 'http://localhost:8000/api'; // Cambiar por la URL de tu API

  constructor(private http: HttpClient) { }

  getEspacios(filtros: any, pageSize: number, page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/espacios`, {
      params: {
        ...filtros,
        per_page: pageSize,
        page: page.toString(),
      },
    });
  }
  // Obtener un espacio por ID
  getEspacioById(id: number): Observable<Espacio> {
    return this.http.get<Espacio>(`${this.apiUrl}/espacios/${id}`);
  }

  // Crear un espacio
  createEspacio(formData: FormData): Observable<Espacio> {
    return this.http.post<Espacio>(`${this.apiUrl}/espacios`, formData);
  }

  // Actualizar un espacio
  updateEspacio(id: number, formData: FormData): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.apiUrl}/espacios/${id}`, formData);
  }

  // Eliminar un espacio
  deleteEspacio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/espacios/${id}`);
  }
}
