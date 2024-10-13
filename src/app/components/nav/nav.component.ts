import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (user: any) => {
        this.user = user;
        console.log(this.user)
      },
      error: (err) => {
        console.error('Error al obtener User ID:', err);
      },
    });
  }

  logout() {
    this.authService.logout(); // Método para manejar el deslogueo
    // Redirigir a la página de inicio o login si es necesario
  }
}
