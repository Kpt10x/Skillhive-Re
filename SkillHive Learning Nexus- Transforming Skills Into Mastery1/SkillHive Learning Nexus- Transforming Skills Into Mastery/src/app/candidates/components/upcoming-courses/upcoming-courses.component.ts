import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CandidateService, Candidate } from '../../services/candidate.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';
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
  enrolledCourses: any[] = [];
  filteredCourses: any[] = [];
  isCoursesDropdownVisible = false;


  constructor(
    private http: HttpClient,
    private candidateService: CandidateService,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    const loggedInUserId = this.candidateService.getLoggedInCandidateId();
console.log(loggedInUserId, "Starrrrr");
    if (loggedInUserId) {
      this.candidateService.getCandidateById(loggedInUserId).subscribe({
        next: (candidate) => {
          console.log(candidate);
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
          console.log("Dafff",this.courses)

          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          // Fetch enrolled courses from the backend
          this.http.get(`http://localhost:3000/courses-enrolled-by-candidates?candidateId=${this.user?.id}`)
            .subscribe({
              next: (enrolledData: any) => {
                if (Array.isArray(enrolledData)) {
                  this.enrolledCourses = enrolledData;

                  // Filter out courses the candidate has already enrolled in
                  this.filteredCourses = this.courses.filter(
                    (course) =>
                      !this.enrolledCourses.some((enrolledCourse: any) => enrolledCourse.courseId === course.courseId) &&
                      new Date(course.startDate) >= tomorrow &&
                      new Date(course.endDate) >= today
                  );
                }
              },
              error: (err) => {
                console.error('Error fetching enrolled courses:', err);
              }
            });
        }
      });
  }

  enroll(course: any): void {
    if (!this.user) {
      alert('User not found.');
      return;
    }

    // Check if the candidate has already enrolled in the course
    const alreadyEnrolled = this.enrolledCourses.some(
      (enrolledCourse: any) => enrolledCourse.courseId === course.courseId
    );

    if (alreadyEnrolled) {
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

    const enrollmentData = {
      id: this.generateSessionId(),
      candidateId: this.user.id,
      courseId: course.courseId,
      courseName: course.courseName,
      courseCategory: course.courseCategory,
      courseDurationInMonths: course.courseDurationInMonths,
      instructor: course.instructor,
      startDate: course.startDate,
      endDate: course.endDate,
    };

    this.http.post('http://localhost:3000/courses-enrolled-by-candidates', enrollmentData)
      .subscribe({
        next: () => {
          alert('Enrolled successfully!');
          this.enrolledCourses.push(course); // Add to enrolled courses

          // Remove the course from filtered courses
          this.filteredCourses = this.filteredCourses.filter(
            (c) => c.courseId !== course.courseId
          );
        },
        error: (err) => {
          console.error('Error enrolling in course:', err);
          alert('Failed to enroll. Please try again.');
        },
      });
  }

  private generateSessionId(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  isCourseFinished(course: any): boolean {
    const today = new Date();
    return new Date(course.endDate) < today;
  }

  isCourseAvailable(course: any): boolean {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    return course.openForEnrollment && // Check if enrollment is open
           new Date(course.startDate) >= tomorrow && 
           new Date(course.endDate) >= today;
  }
  logout(): void {
    this.authService.logout();
  }
}
