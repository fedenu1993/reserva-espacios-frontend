import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrls: ['./reserva-modal.component.scss'],
})
export class ReservaModalComponent{

  crear = false;
  mismoUserId = false;

  constructor(
    public dialogRef: MatDialogRef<ReservaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {

    console.log(this.data)

    // Crear
    if(!this.data.id){
      this.crear = true; 
    }else{
      // Editar solo en el caso que sea el mismo usuario
      this.authService.getUser().subscribe({
        next: (user: any) => {
          console.log('User ID:', user, this.data.user_id);
          if (user && user.id) {
            this.mismoUserId = user.id == this.data.user_id;
          }
        },
        error: (err) => {
          console.error('Error al obtener User:', err);
        },
      });

    };

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // if(this.mismoUserId && !this.crear){
      this.dialogRef.close(this.data);
    // }
  }
}
