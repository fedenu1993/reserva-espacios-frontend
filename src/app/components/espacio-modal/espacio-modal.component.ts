import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Espacio } from 'src/app/models/espacio.model';
import { EspacioService } from 'src/app/services/espacios/espacios.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid'; // Importar plugin de día
import timeGridPlugin from '@fullcalendar/timegrid'; // Importar plugin de hora
import interactionPlugin from '@fullcalendar/interaction'; // Importar plugin de interacción
import { ReservaService } from 'src/app/services/reservas/reserva.service';
import { Reserva } from 'src/app/models/reserva.model';
import { ReservaModalComponent } from '../reserva-modal/reserva-modal.component';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import esLocale from '@fullcalendar/core/locales/es'; // Importar español
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-espacio-modal',
  templateUrl: './espacio-modal.component.html',
  styleUrls: ['./espacio-modal.component.scss'],
})
export class EspacioModalComponent implements OnInit {
  espacio!: Espacio;
  user: User | undefined = undefined;
  vistaActual: string = '';
  espaciosMode: boolean = false;

  // Configuración del calendario
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Especificar los plugins
    initialView: 'timeGridWeek',
    locale: esLocale, // Establecer el idioma
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    selectable: true,
    editable: true,
    events: [],
    // slotMinTime: this.getCurrentTime(), // Establecer hora mínima como la hora actual
    validRange: {
      start: new Date(), // Solo permite fechas desde ahora en adelante
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private espacioService: EspacioService,
    private reservaService: ReservaService,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    public dialogRef: MatDialogRef<EspacioModalComponent>,
    public dialogRefReserva: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.vistaActual = this.router.url;

    if (this.data.id) {
      // Cargar el espacio existente
      // forkJoin para ejecutar ambas solicitudes en paralelo
      forkJoin({
        user: this.authService.getUser(),
        // Solicitud para obtener el detalle completo, incluida la imagen
        espacio: this.espacioService.getEspacioById(this.data.id),
      }).subscribe({
        next: ({ user, espacio }) => {
          this.user = user;
          this.espacio = espacio;
          this.espaciosMode =
            this.user?.role === 'admin' && this.vistaActual == '/espacios';
          this.loadReservations();
        },
        error: (err) => {
          console.error('Error al cargar datos:', err);
          this.espacio = {
            id: 0,
            nombre: '',
            capacidad: 0,
            disponible: false,
            imagen: '',
          }; // Valor predeterminado en caso de error
        },
      });
    } else {

      this.authService.getUser().subscribe({
        next: (user: User) => {
          this.user = user;
        },
        error: (err) => {
          console.error('Error al obtener User ID:', err);
        },
      });
      // Inicializar un nuevo espacio
      this.espacio = {
        id: 0,
        nombre: '',
        capacidad: 0,
        disponible: false,
        imagen: '',
      };
      this.espaciosMode = true; // Si quieres permitir la edición en el modo de creación
    }

  }

  getCurrentTime() {
    const now = new Date();
    // Formatear la hora actual a 'HH:mm:ss'
    return `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:00`;
  }

  loadReservations(): void {
    console.log('por')
    if (!this.espaciosMode) {
      console.log('SI')
      // Aquí deberías realizar una llamada a tu API para obtener las reservas
      // y asignarlas a this.calendarOptions.events
      this.reservaService.getReservas(this.espacio.id).subscribe({
        next: (data) => {
          // Mapear las reservas a un formato que FullCalendar entienda
          this.calendarOptions.events = data.map((reserva: Reserva) => ({
            id: reserva.id, // Almacenar el ID de la reserva
            user_id: reserva.user_id, // Almacenar el user_id de la reserva
            espacio_id: reserva.espacio_id, // Almacenar el espacio_id de la reserva
            title: reserva.nombre, // Puedes personalizar el título
            start: `${reserva.fecha}T${reserva.hora_inicio}`, // Concatenar fecha y hora de inicio
            end: `${reserva.fecha}T${reserva.hora_fin}`, // Concatenar fecha y hora de fin
            allDay: false, // Cambia esto si es una reserva de todo el día
            backgroundColor:
              this.user?.id == reserva.user_id ? '#007BFF' : '#FFC107', // Cambia el color de fondo del evento
            borderColor:
              this.user?.id == reserva.user_id ? '#0056b3' : '#FFA000', // Cambia el color del borde del evento
            textColor: this.user?.id == reserva.user_id ? '#white' : '#black', // Cambia el color del texto del evento
          }));
        },
        error: (err) => {
          console.error('Error al obtener reservas:', err);
        },
      });
    }
  }

  handleDateClick(arg: any) {
    const startDate = new Date(arg.date); // Crear un objeto de fecha a partir de arg.date
    const endDate = new Date(startDate); // Copiar el objeto de fecha para la hora de fin
    endDate.setHours(startDate.getHours() + 1); // Establecer la hora de fin 1 hora después

    // Formatear horas como HH:mm
    const start = this.formatTime(startDate); // Formato de hora de inicio
    const end = this.formatTime(endDate); // Formato de hora de fin

    // Llamar al método para abrir el modal de reserva
    this.openReservationModal(
      startDate.toISOString().substring(0, 10),
      start,
      end
    );
  }

  openReservationModal(
    fecha: string,
    hora_inicio: string,
    hora_fin: string,
    reservaData: any = {}
  ): void {
    const dialogRef = this.dialogRefReserva.open(ReservaModalComponent, {
      width: '80vw', // Puedes ajustar el tamaño del modal
      height: '80vh', // Puedes ajustar el tamaño del modal
      data: {
        espacio_id: this.espacio.id,
        fecha,
        hora_inicio,
        hora_fin,
        ...reservaData, // Agregar los datos de reserva si existen (para edición)
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!result.id) {
          this.createReservation(result); // Crear reserva si no tiene ID
        } else {
          this.updateReservation(result); // Editar reserva si tiene ID
        }
      }
    });
  }

  createReservation(reservationData: any): void {
    const formData = new FormData();
    // formData.append('user_id', this.user_id);
    formData.append('nombre', reservationData.nombre);
    formData.append('espacio_id', reservationData.espacio_id);
    formData.append('fecha', reservationData.fecha);
    formData.append('hora_inicio', reservationData.hora_inicio);
    formData.append('hora_fin', reservationData.hora_fin);
    this.reservaService.createReserva(formData).subscribe({
      next: (data) => {
        // Mensaje de éxito
        this.notificacionService.showSuccess('Reserva creada con éxito');
        this.loadReservations(); // Recargar las reservas para que aparezca en el calendario
      },
      error: (err) => {
        // Usar el servicio para manejar el error
        const errorMessage = this.notificacionService.handleHttpError(err);
        this.notificacionService.showError(errorMessage);
        console.error('Error al crear la reserva:', err);
      },
    });
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0'); // Asegura que tenga 2 dígitos
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Asegura que tenga 2 dígitos
    return `${hours}:${minutes}`; // Devuelve el formato "H:i"
  }

  handleEventClick(info: any): void {
    const event = info.event;

    const reservationData = {
      id: event.id,
      nombre: event.title,
      espacio_id: event.extendedProps.espacio_id,
      user_id: event.extendedProps.user_id,
      fecha: event.start?.toISOString().substring(0, 10),
      hora_inicio: this.formatTime(new Date(event.start!)),
      hora_fin: this.formatTime(new Date(event.end!)),
    };
    
    this.openReservationModal(
      reservationData.fecha,
      reservationData.hora_inicio,
      reservationData.hora_fin,
      reservationData
    );
  }

  updateReservation(reservationData: any): void {

    this.reservaService
      .updateReserva(reservationData.id, reservationData)
      .subscribe({
        next: (data) => {
          this.notificacionService.showSuccess('Reserva editada con éxito');
          this.loadReservations(); // Recargar reservas
        },
        error: (err) => {
          const errorMessage = this.notificacionService.handleHttpError(err);
          this.notificacionService.showError(errorMessage);
          console.error('Error al editar la reserva:', err);
        },
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.espacio.imagen = e.target.result; // Carga la imagen como base64
      };
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    // Implementar lógica para guardar los cambios, por ejemplo, llamar a un servicio.

    if (this.espacio.id === 0) {
      // Lógica para crear un nuevo espacio
      this.espacioService.createEspacio(this.espacio).subscribe({
        next: (espacio) => {
          this.notificacionService.showSuccess('Espacio creado con éxito');
          this.dialogRef.close(espacio); // Pasar el espacio creado al cerrar el modal
        },
        error: (err) => {
          const errorMessage = this.notificacionService.handleHttpError(err);
          this.notificacionService.showError(errorMessage);
          console.error('Error al crear espacio:', err);
        }
      });
    } else {
      this.espacioService.updateEspacio(this.espacio.id, this.espacio).subscribe({
        next: (espacio) => {
          this.notificacionService.showSuccess('Guardado con éxito');
        },
        error: (err) => {
          const errorMessage = this.notificacionService.handleHttpError(err);
          this.notificacionService.showError(errorMessage);
          console.error('Error al cargar datos:', err);
        },
      });
  
    }

  }


  
}
