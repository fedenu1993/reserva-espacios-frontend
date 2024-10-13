import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      // panelClass: ['green-snackbar'],
      panelClass: ['custom-snackbar', 'snackbar-success']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      // panelClass: ['red-snackbar'],
      panelClass: ['custom-snackbar', 'snackbar-error']

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
}
