import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { ModalUserComponent } from '../modal-user/modal-user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loading = true; // Variable para manejar el estado de carga
  loginForm: FormGroup;
  hide = true;  // Para mostrar u ocultar la contraseña

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {


    const token = this.authService.getToken();
    // Si hay un token, clonamos la request para añadir el header de Authorization
    if (token) {
      this.router.navigate(['/principal']); // Redirigir a la página de espacios si ya está autenticado
    }else{
      this.loading = false;
    }


  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        () => {
          this.notificacionService.showSuccess('Login exitoso!')
          this.router.navigate(['/principal']); // Redirigir al listado de espacios tras login exitoso
        },
        error => {
          this.notificacionService.showError('Las credenciales no son correctas');
          console.error('Error en el login', error);
        }
      );
    }
  }


  openModalUser(): void {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
      }
    });
  }

}


