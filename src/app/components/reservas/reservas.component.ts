import { Component } from '@angular/core';
import { Reserva } from 'src/app/models/reserva.model';
import { ReservaService } from 'src/app/services/reservas/reserva.service';
import { ReservaModalComponent } from '../reserva-modal/reserva-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent {
  reservas: any[] = []; // Almacenará todas las reservas
  displayedColumns: string[] = ['nombre', 'espacio', 'fecha', 'hora_inicio', 'hora_fin', 'acciones']; // Columnas visibles
  private reservasSub!: Subscription;

  constructor(
    private reservaService: ReservaService, 
    private notificacionService: NotificacionService, 
    public dialogRefReserva: MatDialog,
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  // Suscribirnos a los cambios en las reservas
  this.reservasSub = this.reservaService.getReservasUpdateListener().subscribe({
    next: (reservas: Reserva[]) => {
      this.cargarReservas();
    },
    error: (err) => {
      console.error('Error al cargar reservas:', err);
    }
  });


  }

  cargarReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        console.log('Reservas cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
      },
    });
  }

  verReserva(reserva: any){

    reserva.hora_inicio = this.formatHora(reserva.hora_inicio);
    reserva.hora_fin = this.formatHora(reserva.hora_fin);

    const dialogRef = this.dialogRefReserva.open(ReservaModalComponent, {
      width: '80vw', // Puedes ajustar el tamaño del modal
      height: '80vh', // Puedes ajustar el tamaño del modal
      data: {
        ...reserva, // Agregar los datos de reserva si existen (para edición)
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('ssss', result);
      if (result) {
        console.log('ssss', result);

          this.updateReservation(result); // Editar reserva si tiene ID
        
      }
    });
  }

  updateReservation(reservationData: any): void {
    console.log(reservationData);

    this.reservaService
      .updateReserva(reservationData.id, reservationData)
      .subscribe({
        next: (data) => {
          console.log('Cambios guardados:', data);
          this.notificacionService.showSuccess('Reserva editada con éxito');
        },
        error: (err) => {
          const errorMessage = this.notificacionService.handleHttpError(err);
          this.notificacionService.showError(errorMessage);
          console.error('Error al editar la reserva:', err);
        },
      });
  }
  
  cancelarReserva(id: number): void {
    const message = '¿Estás seguro de que deseas eliminar esta reserva?';
  
    this.notificacionService.confirmDelete(message).then((result) => {
      if (result) {
        // El usuario ha confirmado la eliminación
        console.log('Eliminar espacio:', id);
        // Llama a tu método de eliminación aquí
        this.reservaService.deleteReserva(id).subscribe({
          next: () => {
            this.notificacionService.showSuccess('Reserva eliminada correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar reserva:', err);
            const errorMessage = this.notificacionService.handleHttpError(err);
            this.notificacionService.showError(errorMessage);
          }
        });
      } else {
        // El usuario ha cancelado la eliminación
        console.log('Eliminación cancelada');
      }
    });
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0'); // Asegura que tenga 2 dígitos
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Asegura que tenga 2 dígitos
    return `${hours}:${minutes}`; // Devuelve el formato "H:i"
  }

  formatHora(hora: string): string {
    const [hours, minutes] = hora.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }
  

}
