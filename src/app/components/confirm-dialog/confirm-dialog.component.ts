import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar Eliminación</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button (click)="onConfirm()">Eliminar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string } // Inyección de datos
  ) {}

  onCancel(): void {
    this.dialogRef.close(false); // Cierra el diálogo sin confirmar
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el diálogo confirmando
  }
}
