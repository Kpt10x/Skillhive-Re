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
    private authService: AuthService
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
      .get('http://localhost:5000/api/courses')
      .pipe(
        catchError((error) => {
          console.error('Error fetching courses:', error);
          return of([]);
        })
      )
      .subscribe((data: any) => {
        if (Array.isArray(data)) {
          this.courses = data;
          console.log("All courses:", this.courses);

          // Get today's date and set time to start of day
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Fetch enrolled courses from the backend
          this.http.get(`http://localhost:5000/api/enrollments?candidateId=${this.user?.id}`)
            .subscribe({
              next: (enrolledData: any) => {
                if (Array.isArray(enrolledData)) {
                  this.enrolledCourses = enrolledData;

                  // Filter out courses the candidate has already enrolled in
                  this.filteredCourses = this.courses.filter(course => {
                    // Convert course start date to Date object and set time to start of day
                    const startDate = new Date(course.startDate);
                    startDate.setHours(0, 0, 0, 0);

                    // Check if course is not enrolled, open for enrollment, has content, and starts today or later
                    return !this.enrolledCourses.some(enrolled => enrolled.courseId === course.courseId) &&
                           course.openForEnrollment === true &&
                           course.content !== "" &&
                           startDate >= today;
                  });
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

    // Set time to start of day for accurate date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(course.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(course.endDate);
    endDate.setHours(0, 0, 0, 0);

    // Allow enrollment for courses starting today or in the future
    if (startDate < today || endDate < today) {
      alert('You can only enroll in courses starting from today.');
      return;
    }

    const enrollmentData = {
      id: this.generateSessionId(),
      candidateId: this.user.id,
      courseId: course.courseId,
      courseName: course.courseName,
      courseCategory: course.courseCategory,
      instructor: course.instructor,
      startDate: course.startDate,
      endDate: course.endDate
    };

    // First update the course seats
    const updatedCourse = { 
      ...course, 
      seatsLeft: course.seatsLeft - 1 
    };
    
    console.log('Original course:', course);
    console.log('Updated course:', updatedCourse);

    this.http.put(`http://localhost:5000/api/courses/${course.id}`, updatedCourse)
      .subscribe({
        next: () => {
          // Then create the enrollment
          this.http.post('http://localhost:5000/api/enrollments', enrollmentData)
            .subscribe({
              next: () => {
                alert('Enrolled successfully!');
                this.loadCourses(); // Reload the courses to update the list
                // Remove the course from filtered courses
                this.filteredCourses = this.filteredCourses.filter(
                  (c) => c.courseId !== course.courseId
                );
              },
              error: (err) => {
                console.error('Error creating enrollment:', err);
                alert('Failed to complete enrollment. Please try again.');
              }
            });
        },
        error: (err) => {
          console.error('Error updating course seats:', err);
          alert('Failed to update course seats. Please try again.');
        }
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
    // Set time to start of day for accurate date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(course.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    return course.openForEnrollment && // Check if enrollment is open
           startDate >= today;  // Allow enrollment for courses starting today or later
  }

  logout(): void {
    this.authService.logout();
  }
}
