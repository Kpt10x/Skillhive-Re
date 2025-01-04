import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  enrolledCourses: any[];
}

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/courses-enrolled-by-candidates';
  private coursesUrl = 'http://localhost:3000/courses';
  private loggedInCandidateId: string | null = null;

  constructor(private http: HttpClient) {}

  setLoggedInCandidateId(id: string): void {
    this.loggedInCandidateId = id;
    sessionStorage.setItem('loggedInCandidate', id);
  }

  getLoggedInCandidateId(): string | null {
    return this.loggedInCandidateId || sessionStorage.getItem('loggedInCandidate');
  }

  clearLoggedInCandidateId(): void {
    this.loggedInCandidateId = null;
  }

  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      map((data) => data || [])
    );
  }

  generateUserId(): Observable<string> {
    return this.getAllCandidates().pipe(
      map((candidates: Candidate[]) => {
        if (candidates.length === 0) return 'u01';
        const lastUserId = parseInt(candidates[candidates.length - 1].id.slice(1)) || 0;
        return `u${(lastUserId + 1).toString().padStart(2, '0')}`;
      })
    );
  }

  registerCandidate(candidate: Candidate): Observable<Candidate> {
    return this.generateUserId().pipe(
      map((userId) => ({ ...candidate, id: userId })),
      switchMap((candidateWithId) =>
        this.http.post<Candidate>(this.apiUrl, candidateWithId)
      )
    );
  }

  authenticateCandidate(email: string, password: string): Observable<Candidate | null> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      map((candidates) => 
        candidates.find(c => c.email === email && c.password === password) || null
      )
    );
  }

  getCandidateById(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  updateCandidate(id: string, updatedCandidate: Partial<Candidate>): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, updatedCandidate);
  }

  getEnrolledCourses(candidateId: string): Observable<any[]> {
    return this.getCandidateById(candidateId).pipe(
      switchMap(candidate => {
        const enrolledIds = candidate.enrolledCourses.map((course) => course.courseId);
        return this.http.get<any[]>(this.coursesUrl).pipe(
          map(courses => courses.filter(course => enrolledIds.includes(course.courseId)))
        );
      })
    );
  }
}
