import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Assuming the Candidate interface/model looks like this
export interface Candidate {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  enrolledCourses: any[];  // Add enrolledCourses as an array of course objects
  // Optional for registration, can be added during update
}


@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates'; // json-server API URL for candidates

  constructor(private http: HttpClient) {}

  // Fetch all candidates
  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      map((data) => {
        console.log('Fetched candidates:', data); // Log fetched candidates
        return data;
      })
    );
  }

  // User ID generation for new candidates
  generateUserId(): Observable<string> {
    return this.getAllCandidates().pipe(
      map((candidates: Candidate[]) => {
        if (!Array.isArray(candidates) || candidates.length === 0) {
          return 'u01'; // Start from 'u01' if no candidates exist
        }

        const lastUser = candidates[candidates.length - 1];

        // Safely extract and validate the ID
        const lastUserId = lastUser?.id?.startsWith('u')
          ? parseInt(lastUser.id.substring(1), 10)
          : NaN;

        const nextUserId = isNaN(lastUserId) ? 1 : lastUserId + 1;
        return `u${nextUserId.toString().padStart(2, '0')}`;
      })
    );
  }

  // Register a new candidate
  registerCandidate(candidate: Candidate): Observable<Candidate> {
    return this.generateUserId().pipe(
      map((userId) => {
        candidate.id = userId; // Assign generated ID to the candidate
        return candidate;
      }),
      switchMap((candidateWithId) =>
        this.http.post<Candidate>(this.apiUrl, candidateWithId)
      )
    );
  }

  // Fetch a candidate by ID
  getCandidateById(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  // Update an existing candidate's profile
  updateCandidate(id: string, updatedCandidate: Partial<Candidate>): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, updatedCandidate);
  }
}
