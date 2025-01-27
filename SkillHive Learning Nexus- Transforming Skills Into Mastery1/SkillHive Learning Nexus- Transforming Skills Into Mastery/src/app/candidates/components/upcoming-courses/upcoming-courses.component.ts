import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CandidateService, Candidate } from '../../services/candidate.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upcoming-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upcoming-courses.component.html',
  styleUrls: ['./upcoming-courses.component.css'],
})
export class UpcomingCoursesComponent implements OnInit {
  courses: any[] = [];
  user: Candidate | null = null;
  filteredCourses: any[] = [];

  constructor(
    private http: HttpClient,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    const loggedInUserId = this.candidateService.getLoggedInCandidateId();

    if (loggedInUserId) {
      this.candidateService.getCandidateById(loggedInUserId).subscribe({
        next: (candidate) => {
          this.user = candidate;
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error fetching logged-in candidate:', err);
        },
      });
    } else {
      console.error('No logged-in candidate found.');
    }
  }

  loadCourses(): void {
    this.http
      .get('http://localhost:3000/courses')
      .pipe(
        catchError((error) => {
          console.error('Error fetching courses:', error);
          return of([]);
        })
      )
      .subscribe((data: any) => {
        if (Array.isArray(data)) {
          this.courses = data;

          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          if (this.user && Array.isArray(this.user.enrolledCourses)) {
            const enrolledCourseIds = this.user.enrolledCourses.map(
              (course: any) => course.courseId
            );
            this.filteredCourses = this.courses.filter(
              (course) =>
                !enrolledCourseIds.includes(course.courseId) &&
                new Date(course.startDate) >= tomorrow &&
                new Date(course.endDate) >= today
            );
          } else {
            this.filteredCourses = this.courses.filter(
              (course) =>
                new Date(course.startDate) >= tomorrow &&
                new Date(course.endDate) >= today
            );
          }
        }
      });
  }

  enroll(course: any): void {
    if (!this.user) {
      alert('User not found.');
      return;
    }

    if (!Array.isArray(this.user.enrolledCourses)) {
      this.user.enrolledCourses = [];
    }

    const isAlreadyEnrolled = this.user.enrolledCourses.some(
      (enrolledCourse: any) => enrolledCourse.courseId === course.courseId
    );

    if (isAlreadyEnrolled) {
      alert('You are already enrolled in this course.');
      return;
    }

    const today = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (startDate <= today || endDate < today) {
      alert('You can only enroll in courses starting from tomorrow.');
      return;
    }

    this.user.enrolledCourses.push(course);

    const updatedCandidate = { ...this.user };
    this.candidateService.updateCandidate(this.user.id, updatedCandidate).subscribe({
      next: () => {
        alert('Enrolled successfully!');
        this.filteredCourses = this.filteredCourses.filter(
          (c) => c.courseId !== course.courseId
        );
      },
      error: (err) => {
        console.error('Error updating candidate:', err);
        alert('Failed to enroll. Please try again.');
      },
    });
  }

  isCourseFinished(course: any): boolean {
    const today = new Date();
    return new Date(course.endDate) < today;
  }

  isCourseAvailable(course: any): boolean {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return new Date(course.startDate) >= tomorrow && new Date(course.endDate) >= today;
  }
}
