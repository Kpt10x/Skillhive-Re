import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Candidate } from '../../models/candidate.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upcoming-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-courses.component.html',
  styleUrls: ['./upcoming-courses.component.css'],
})
export class UpcomingCoursesComponent implements OnInit {
  courses: any[] = [];
  candidates: Candidate[] = [];
  id: string = '';
  user: Candidate | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || 'u01';

    // Fetch courses from JSON Server
    this.http.get('http://localhost:3000/courses').pipe(
      catchError((error) => {
        console.error('Error fetching courses:', error);
        return of({ courses: [] });
      })
    ).subscribe((data: any) => {
      this.courses = data.courses || [];
    });

    // Fetch candidates from JSON Server
    this.http.get('http://localhost:3000/candidates').pipe(
      catchError((error) => {
        console.error('Error fetching candidates:', error);
        return of({ candidates: [] });
      })
    ).subscribe((data: any) => {
      this.candidates = data.candidates.map((candidate: Candidate) => ({
        ...candidate,
        enrolledCourses: candidate.enrolledCourses || [],
      }));

      // Set the current user based on the route ID
      this.user = this.candidates.find(candidate => candidate.id === this.id);

      if (!this.user) {
        console.error(`User with ID ${this.id} not found.`);
      }
    });
  }

  enroll(course: any) {
    if (!this.user) {
      alert('User not found.');
      return;
    }

    // Check if the course is already enrolled
    const alreadyEnrolled = this.user.enrolledCourses.some((c: any) => c.courseId === course.courseId);
    if (alreadyEnrolled) {
      alert('Already enrolled in this course.');
      return;
    }

    // Add the course to the user's enrolledCourses array
    this.user.enrolledCourses.push(course);

    // Persist the changes to the mock JSON server
    const updatedCandidate = { ...this.user }; // Clone the user to avoid direct mutation
    this.http.put(`http://localhost:3000/candidates/${this.user.id}`, updatedCandidate).subscribe({
      next: () => {
        alert('Enrolled successfully!');
      },
      error: (err) => {
        console.error('Error updating candidate:', err);
        alert('Failed to enroll. Please try again.');
      },
    });
  }
}
