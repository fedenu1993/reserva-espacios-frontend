import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';

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
    private router: Router
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
          this.router.navigate(['/principal']); // Redirigir al listado de espacios tras login exitoso
        },
        error => {
          this.notificacionService.showError('Las credenciales no son correctas');
          console.error('Error en el login', error);
        }
      );
    }
  }

}


