import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course_model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:5000/api/courses'; // Endpoint URL
  private enrollmentApiUrl = 'http://localhost:5000/api/enrollments'; // Enrollment API URL

  constructor(private http: HttpClient) {}

  // Fetch courses from the API
  fetchCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  // Fetch a specific course by ID
  fetchCourseById(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`);
  }

  // Update course
  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course);
  }

  // Delete course
  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Update course seat data after candidate enrollment
  updateCourseSeats(courseId: string, seatsLeft: number): Observable<any> {
    const body = { seatsLeft };  // Pass the updated seatsLeft in the body
    return this.http.put(`${this.apiUrl}/${courseId}/seats`, body);
  }

  // Get all enrolled candidates
  getEnrolledCandidates(): Observable<any[]> {
    return this.http.get<any[]>(this.enrollmentApiUrl);
  }

  // Enroll a candidate in a course
  enrollCandidate(courseId: string, candidateId: string): Observable<any> {
    const enrollmentData = {
      courseId: courseId,
      candidateId: candidateId,
    };
    return this.http.post(this.enrollmentApiUrl, enrollmentData);
  }

  // Fetch enrollments for a specific course
  getEnrollmentsForCourse(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.enrollmentApiUrl}?courseId=${courseId}`);
  }

  // Fetch courses with enrollments
  fetchCoursesWithEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?includeEnrollments=true`);
  }
}
