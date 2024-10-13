import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private notificacionService: NotificacionService,
    public dialogRef: MatDialogRef<ModalUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Puedes usar esto si necesitas pasar datos al diálogo
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['user', [Validators.required]], // Suponiendo que el rol por defecto es 'user'
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.usersService.createUser(this.userForm.value).subscribe({
        next: (response) => {
          console.log('Usuario creado con éxito, ya puedes loguearte', response);
          this.notificacionService.showSuccess('Usuario creado con éxito')
          this.dialogRef.close(); // Cierra el diálogo
        },
        error: (err) => {
          console.error('Error al crear el usuario', err);
          this.notificacionService.showError('Error al crear el usuario')
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cierra el diálogo sin guardar
  }
}
