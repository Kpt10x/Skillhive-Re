import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { profiles} from '../models/interfaces/auth';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  getUserByEmail(email: string): Observable<profiles[]> {
    return this.http.get<profiles[]>(`${this.baseUrl}/profiles?email=${email}`).pipe(
      catchError((error) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Could not retrieve user details.'));
      })
    );
  }

  logout() {
    sessionStorage.clear(); 
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        history.pushState(null, '', location.href);
        window.onpopstate = () => {
          history.pushState(null, '', location.href);
        };
      }, 0);
    })
}
}
