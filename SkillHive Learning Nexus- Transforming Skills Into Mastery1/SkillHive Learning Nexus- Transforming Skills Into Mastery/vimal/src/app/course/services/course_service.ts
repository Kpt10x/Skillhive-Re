import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service globally available
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  saveCourse(courseData: any): Observable<any> {
    return this.http.post(this.apiUrl, courseData);
  }

  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}`);
  }
}