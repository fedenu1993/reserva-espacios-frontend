import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Reserva } from 'src/app/models/reserva.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = environment.apiUrl; // Cambiar por la URL de tu API
  private reservasUpdated = new Subject<Reserva[]>(); // Subject para emitir actualizaciones

  constructor(private http: HttpClient) {}

  getReservas(espacio_id: number = 0): Observable<any> {
    let url = `${this.apiUrl}/reservas`;
    if (espacio_id > 0) {
      url = url + `?espacio_id=${espacio_id}`;
    }
    return this.http.get<any>(url);
  }

  // Obtener un reserva por ID
  getReservaById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/reservas/${id}`);
  }

  // Crear una reserva y emitir la lista actualizada
  createReserva(formData: FormData): Observable<Reserva> {
    return new Observable((observer) => {
      this.http.post<Reserva>(`${this.apiUrl}/reservas`, formData).subscribe({
        next: (reserva) => {
          this.fetchReservas(); // Refrescar la lista
          observer.next(reserva);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }

  // Actualizar una reserva y emitir la lista actualizada
  updateReserva(id: number, formData: FormData): Observable<Reserva> {

    return new Observable((observer) => {
      this.http
        .put<Reserva>(`${this.apiUrl}/reservas/${id}`, formData)
        .subscribe({
          next: (reserva) => {
            this.fetchReservas(); // Refrescar la lista
            observer.next(reserva);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  // Eliminar una reserva y emitir la lista actualizada
  deleteReserva(id: number): Observable<void> {
    return new Observable((observer) => {
      this.http.delete<void>(`${this.apiUrl}/reservas/${id}`).subscribe({
        next: () => {
          this.fetchReservas(); // Refrescar la lista
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
  // Función para obtener y emitir la lista de reservas
  private fetchReservas() {
    this.getReservas().subscribe((reservas) => {
      this.reservasUpdated.next(reservas.data); // Emitir la nueva lista
    });
  }

  getReservasUpdateListener(): Observable<Reserva[]> {
    return this.reservasUpdated.asObservable(); // Exponer el Subject como Observable
  }
}
