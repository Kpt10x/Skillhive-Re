// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profiles';  // URL to the mock JSON server

  constructor(private http: HttpClient) { }

  // Get profile data (assuming the profile with id = 1)
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/1`); // Fetch profile by id (1)
  }

  // Update profile data
  updateProfile(updatedProfile: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/1`, updatedProfile); // Update profile by id (1)
  }
}
