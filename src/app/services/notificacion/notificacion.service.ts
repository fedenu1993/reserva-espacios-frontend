import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['custom-snackbar', 'snackbar-success'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['custom-snackbar', 'snackbar-error'],
    });
  }

  handleHttpError(error: any): string {
    if (error.error && error.error.errors) {
      // Concatenar los mensajes de error para mostrarlos
      const messages = Object.values(error.error.errors).flat();
      return messages.join(', ');
    }
    return 'Error desconocido. Por favor, inténtalo de nuevo.';
  }

  // Método para mostrar el diálogo de confirmación con un mensaje dinámico
  confirmDelete(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message }, // Pasa el mensaje al diálogo
    });
    return firstValueFrom(dialogRef.afterClosed()); // Retorna una promesa
  }

}
