import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';  // <-- Correct import for forkJoin
import { map, switchMap } from 'rxjs/operators';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  enrolledCourses: any[];
}

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/profiles'; // API URL for candidate profiles
  private coursesUrl = 'http://localhost:3000/courses'; // API URL for courses (if required)
  private coursesEnrolledUrl = 'http://localhost:3000/courses-enrolled-by-candidates'; // API URL for courses enrolled by candidates

  private loggedInCandidateId: string | null = null;

  constructor(private http: HttpClient) {}

  // Manage logged-in candidate ID - set in login.component.ts
  // setLoggedInCandidateId(id: string): void {
  //   this.loggedInCandidateId = id;
  //   sessionStorage.setItem('loggedInCandidate', id);
  // }

  getLoggedInCandidateId(): string | null {
    const storedId = sessionStorage.getItem('loggedInCandidateId');
    return this.loggedInCandidateId || (storedId ? JSON.parse(storedId) : null);
    // returned after the convertion of id say "123" to 123 (number)
  }

  clearLoggedInCandidateId(): void {
    this.loggedInCandidateId = null;
    sessionStorage.removeItem('loggedInCandidateId');
  }

  // Fetch all candidates
  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      map((data) => data || [])
    );
  }

  // Generate a random user ID for new candidates
  private generateRandomUserId(): string {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    return randomId.toString();
  }

  // Register a new candidate
  registerCandidate(candidate: Candidate): Observable<Candidate> {
    const generatedId = this.generateRandomUserId();
    const candidateWithIdAndRole = {
      ...candidate,
      id: generatedId,
      role: 'candidate',
    };

    return this.http.post<Candidate>(this.apiUrl, candidateWithIdAndRole);
  }

  // Authenticate a candidate by email and password
  authenticateCandidate(email: string, password: string): Observable<Candidate | null> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      map((candidates) =>
        candidates.find(
          (candidate) => candidate.email === email && candidate.password === password
        ) || null
      )
    );
  }



  // Update a candidate's details
  updateCandidate(id: string, updatedCandidate: Partial<Candidate>): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, updatedCandidate);
  }

  // Fetch courses enrolled by a candidate
  getEnrolledCoursesByCandidate(candidateId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.coursesEnrolledUrl}?candidateId=${candidateId}`);
  }

  // Update a candidate's enrolled courses
  updateCandidateEnrolledCourses(candidateId: string, enrolledCourses: any[]): Observable<Candidate> {
    return this.updateCandidate(candidateId, { enrolledCourses });
  }

  // Fetch candidates visible to admin
  getCandidatesForAdmin(): Observable<Candidate[]> {
    return this.getAllCandidates();
  }

  // Delete a candidate and their enrolled courses
  deleteCandidate(candidateId: string): Observable<void> {
    return this.getEnrolledCoursesByCandidate(candidateId).pipe(
      switchMap((courses) => {
        if (courses.length > 0) {
          // Only attempt to delete courses if there are any
          const deleteCourses$ = courses.map((course) =>
            this.http.delete<void>(`${this.coursesEnrolledUrl}/${course.id}`)
          );
          return forkJoin(deleteCourses$); // Delete all courses if any exist
        } else {
          // If no courses are enrolled, proceed directly to delete the candidate
          return of(null); // No courses to delete, just return an observable that does nothing
        }
      }),
      switchMap(() => this.http.delete<void>(`${this.apiUrl}/${candidateId}`))
    );
  }
  

  // Fetch instructor's profile by ID
  getInstructorProfileById(instructorId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${instructorId}`);
  }

  // Fetch courses enrolled by candidates based on instructor's name
  getCandidatesByInstructor(instructorName: string): Observable<Candidate[]> {
    return this.http.get<any[]>(this.coursesEnrolledUrl).pipe(
      map((enrollmentDetails) => 
        enrollmentDetails
          .filter((enrollment) => enrollment.instructorName === instructorName)
          .map((enrollment) => enrollment.candidateId)
      ),
      switchMap((candidateIds) => {
        const candidates$ = candidateIds.map((id) => this.getCandidateById(id));
        return forkJoin(candidates$);
      })
    );
  }

  // Fetch candidate by ID
  getCandidateById(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }


}
