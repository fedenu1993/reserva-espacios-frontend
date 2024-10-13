import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from 'src/app/models/reserva.model';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = 'http://localhost:8000/api'; // Cambiar por la URL de tu API

  constructor(private http: HttpClient) {}

  getReservas(espacio_id: number = 0): Observable<any> {
    let url = `${this.apiUrl}/reservas`;
    if (espacio_id > 0) {
      url = url + `?espacio_id=${espacio_id}`;
    }
    console.log(url);
    return this.http.get<any>(url);
  }

  // Obtener un reserva por ID
  getReservaById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/reservas/${id}`);
  }

  // Crear un Reserva
  createReserva(formData: FormData): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.apiUrl}/reservas`, formData);
  }

  // Actualizar un Reserva
  updateReserva(id: number, formData: FormData): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/reservas/${id}`, formData);
  }

  // Eliminar un Reserva
  deleteReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservas/${id}`);
  }
}
