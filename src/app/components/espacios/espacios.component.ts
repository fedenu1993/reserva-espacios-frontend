import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Espacio } from 'src/app/models/espacio.model';
import { EspacioService } from 'src/app/services/espacios/espacios.service';
import { PageEvent } from '@angular/material/paginator';
import { EspacioModalComponent } from '../espacio-modal/espacio-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-espacios',
  templateUrl: './espacios.component.html',
  styleUrls: ['./espacios.component.scss'],
})
export class EspaciosComponent implements OnInit {

  vistaAdmin: boolean = false;
  vistaPrincipal: boolean = false;

  displayedColumns: string[] = ['nombre', 'capacidad'];
  dataSource = new MatTableDataSource<Espacio>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalElements: number = 0; // Total de elementos para la paginación
  pageSize: number = 10; // Número de elementos por página
  currentPage: number = 1; // Página actual

  // Filtros
  filterText: string = '';
  filterNumber: number | null = null;
  filterDate: Date | null = null;

  private espaciosSub: Subscription | undefined;

  constructor(
    private espaciosService: EspacioService,
    private notificacionService: NotificacionService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
 ) {}

  ngOnInit(): void {

    this.vistaPrincipal = this.router.url == '/principal';

    this.authService.getUser().subscribe({
      next: (user: User) => {
        if(user.role == 'admin'){
          this.vistaAdmin = true;
          this.displayedColumns.push('acciones');
        }
      },
      error: (err) => {
        console.error('Error al obtener User ID:', err);
      },
    });

    this.loadEspacios(); // Carga inicial de espacios
      // Suscribirse a las actualizaciones de espacios
      this.espaciosSub = this.espaciosService.getEspaciosUpdateListener()
      .subscribe((espacios: Espacio[]) => {
        this.loadEspacios();
      });
  }

  limpiarFiltros() {
    this.filterText = '';
    this.filterNumber = null;
    this.filterDate = null;
    this.loadEspacios();
  }

  loadEspacios(page: number = 1): void {
    const filtros = {
      nombre: this.filterText,
      capacidad: this.filterNumber,
      fecha: this.filterDate
        ? this.filterDate.toISOString().slice(0, 10)
        : null,
    };
    this.espaciosService
      .getEspacios(filtros, this.pageSize, page)
      .subscribe((data: any) => {
        this.dataSource.data = data.data; // Asignar los datos a la fuente de datos
        this.totalElements = data.total; // Total de elementos
        this.currentPage = data.current_page; // Actualiza la página actual
      });
  }

  // Método para abrir el modal con los datos del espacio
  verEspacio(id: number | null): void {
    if(id){

      const espacio = this.dataSource.data.find((e) => e.id === id); // Encuentra el espacio por ID
      if (espacio) {
        this.dialog.open(EspacioModalComponent, {
          width: '1200px', // Puedes ajustar el tamaño del modal
          data: { id }, // Pasa los datos del espacio al modal
        });
      }
    }else{
      this.dialog.open(EspacioModalComponent, {
        width: '1200px', // Puedes ajustar el tamaño del modal
        data: { id: null } // Pasar un ID nulo para indicar que es una creación
      });
    }
  }

  eliminarEspacio(id: number) {
    const message = '¿Estás seguro de que deseas eliminar este espacio? Se eliminarán también las reservas asociadas.';
  
    this.notificacionService.confirmDelete(message).then((result) => {
      if (result) {
        // El usuario ha confirmado la eliminación
        // Llama a tu método de eliminación aquí
        this.espaciosService.deleteEspacio(id).subscribe({
          next: () => {
            this.notificacionService.showSuccess('Espacio eliminado correctamente');
            // Actualiza la lista de espacios aquí si es necesario
          },
          error: (err) => {
            console.error('Error al eliminar espacio:', err);
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

  // Método para manejar cambios de página
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    let numeroPagina = event.pageIndex + 1; // Sumar 1 porque pageIndex comienza en 0
    this.loadEspacios(numeroPagina);
  }
}
