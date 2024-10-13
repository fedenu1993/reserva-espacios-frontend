import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = environment.apiUrl; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) {}

  createUser(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }
}
