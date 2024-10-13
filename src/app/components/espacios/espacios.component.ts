import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Espacio } from 'src/app/models/espacio.model';
import { EspacioService } from 'src/app/services/espacios/espacios.service';
import { PageEvent } from '@angular/material/paginator';
import { EspacioModalComponent } from '../espacio-modal/espacio-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-espacios',
  templateUrl: './espacios.component.html',
  styleUrls: ['./espacios.component.scss']
})
export class EspaciosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'capacidad', 'acciones'];
  dataSource = new MatTableDataSource<Espacio>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalElements: number = 0; // Total de elementos para la paginación
  pageSize: number = 10; // Número de elementos por página
  currentPage: number = 1; // Página actual

  // Filtros
  filterText: string = '';
  filterNumber: number | null = null;
  filterDate: Date | null = null;

  constructor(
    private espaciosService: EspacioService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadEspacios(); // Carga inicial de espacios
  }

  loadEspacios(page: number = 1): void {
    console.log(page, this.pageSize, this.paginator)
    const filtros = {
      nombre: this.filterText,
      capacidad: this.filterNumber,
      fecha: this.filterDate ? this.filterDate.toISOString().slice(0, 10) : null
    }
    this.espaciosService.getEspacios(filtros, this.pageSize, page).subscribe((data: any) => {

      console.log(data, filtros);
      this.dataSource.data = data.data; // Asignar los datos a la fuente de datos
      this.totalElements = data.total; // Total de elementos
      this.currentPage = data.current_page; // Actualiza la página actual
      // this.dataSource.paginator = this.paginator; // Asignar el paginador a la fuente de datos
    });
  }

  // Método para abrir el modal con los datos del espacio
  verEspacio(id: number): void {
    const espacio = this.dataSource.data.find(e => e.id === id); // Encuentra el espacio por ID
    if (espacio) {
      this.dialog.open(EspacioModalComponent, {
        width: '1200px', // Puedes ajustar el tamaño del modal
        data: {id} // Pasa los datos del espacio al modal
      });
    }
  }
  editarEspacio(id: number) {
    console.log('Editar espacio:', id);
  }

  eliminarEspacio(id: number) {
    console.log('Eliminar espacio:', id);
  }

  // Método para manejar cambios de página
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    let numeroPagina = event.pageIndex + 1; // Sumar 1 porque pageIndex comienza en 0
    this.loadEspacios(numeroPagina); 
  }
}
