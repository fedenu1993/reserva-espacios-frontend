import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Espacio } from 'src/app/models/espacio.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EspacioService {

  private apiUrl = environment.apiUrl; // Cambiar por la URL de tu API
  private espaciosUpdated = new Subject<Espacio[]>(); // Subject para emitir actualizaciones

  constructor(private http: HttpClient) {}

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

  createEspacio(espacio: Espacio): Observable<Espacio> {
    return this.http.post<Espacio>(`${this.apiUrl}/espacios`, espacio).pipe(
      // Emitir la actualización en caso de éxito
      tap(() => this.fetchEspacios()) // Llamar a la función para actualizar la lista
    );
  }

  updateEspacio(id: number, espacio: Espacio): Observable<Espacio> {
    return this.http
      .put<Espacio>(`${this.apiUrl}/espacios/${id}`, espacio)
      .pipe(
        tap(() => this.fetchEspacios()) // Emitir la actualización en caso de éxito
      );
  }

  deleteEspacio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/espacios/${id}`).pipe(
      tap(() => this.fetchEspacios()) // Emitir la actualización en caso de éxito
    );
  }

  // Función para obtener y emitir la lista de espacios
  private fetchEspacios() {
    this.getEspacios({}, 10, 1).subscribe((espacios) => {
      this.espaciosUpdated.next(espacios.data); // Emitir la nueva lista
    });
  }

  getEspaciosUpdateListener(): Observable<Espacio[]> {
    return this.espaciosUpdated.asObservable(); // Exponer el Subject como Observable
  }
}
