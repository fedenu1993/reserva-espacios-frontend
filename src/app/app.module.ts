import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { EspaciosComponent } from './components/espacios/espacios.component';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth/auth.guard';
import { CommonModule } from '@angular/common';
import { EspacioModalComponent } from './components/espacio-modal/espacio-modal.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ReservaModalComponent } from './components/reserva-modal/reserva-modal.component';
import { NavComponent } from './components/nav/nav.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { ReservasAbmComponent } from './pages/reservas-abm/reservas-abm.component';
import { EspaciosAbmComponent } from './pages/espacios-abm/espacios-abm.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EspaciosComponent,
    EspacioModalComponent,
    ReservaModalComponent,
    NavComponent,
    PrincipalComponent,
    ReservasAbmComponent,
    EspaciosAbmComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FullCalendarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
