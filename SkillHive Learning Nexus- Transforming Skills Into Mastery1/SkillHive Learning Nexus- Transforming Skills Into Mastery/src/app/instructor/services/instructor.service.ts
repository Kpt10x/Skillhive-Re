import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course } from '../Models/course.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private profilesApiUrl = 'http://localhost:3000/profiles';
  private coursesApiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  // Fetch all instructors by filtering profiles where role is 'instructor'
  getAllInstructors(): Observable<any[]> {
    return this.http.get<any[]>(this.profilesApiUrl).pipe(
      map((profiles) => profiles.filter((profile) => profile.role === 'instructor'))
    );
  }

  // Fetch a single instructor by ID from profiles
  getInstructorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.profilesApiUrl}/${id}`);
  }

  // Update an instructor's details (excluding ID)
  updateInstructor(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.profilesApiUrl}/${id}`, data);
  }

  // Delete an instructor profile
  deleteInstructor(id: string): Observable<any> {
    return this.http.delete<any>(`${this.profilesApiUrl}/${id}`);
  }

  // Fetch all courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesApiUrl);
  }
}
