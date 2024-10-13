import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { PrincipalComponent } from './pages/principal/principal.component';
import { EspaciosAbmComponent } from './pages/espacios-abm/espacios-abm.component';
import { ReservasAbmComponent } from './pages/reservas-abm/reservas-abm.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'espacios',
    component: EspaciosAbmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reservas',
    component: ReservasAbmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
