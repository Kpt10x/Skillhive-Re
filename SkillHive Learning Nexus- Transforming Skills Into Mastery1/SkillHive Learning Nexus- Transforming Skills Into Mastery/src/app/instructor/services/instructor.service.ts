import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from '../Models/instructor.model';
import { Course } from '../Models/course.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  addInstructor(instructor: Instructor): Observable<any> {
    return this.http.post(`${this.baseUrl}/instructors`, instructor);
  }

  getAssignedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/instructors/assigned-courses`);
  }
}
