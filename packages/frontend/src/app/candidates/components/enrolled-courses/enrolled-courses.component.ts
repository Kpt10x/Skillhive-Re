import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, Candidate } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, of, switchMap, map } from 'rxjs';
import { AuthService } from '../../../authentication/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-enrolled-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css'],
})
export class EnrolledCoursesComponent implements OnInit {
  enrolledCourses: any[] = [];
  user: Candidate | null = null;
  isCoursesDropdownVisible = false;
  showWelcomeMessage = true;
  candidateId: string = '';

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.candidateId = this.candidateService.getLoggedInCandidateId() || '';
    this.route.url.subscribe(urlSegments => {
      const currentPath = urlSegments.map(segment => segment.path).join('/');
      this.showWelcomeMessage = currentPath.startsWith('dashboard');
    });

    if (this.candidateId) {
      this.candidateService
        .getCandidateById(this.candidateId)
        .pipe(
          switchMap((candidate) => {
            this.user = candidate;
            // Get enrolled courses and their full details
            return this.http.get<any[]>('http://localhost:5000/api/enrollments').pipe(
              switchMap(enrolledCourses => {
                const candidateEnrollments = enrolledCourses.filter(ec => ec.candidateId === this.candidateId);
                
                // Get full course details for each enrolled course
                return this.http.get<any[]>('http://localhost:5000/api/courses').pipe(
                  map(allCourses => {
                    return candidateEnrollments.map(enrollment => {
                      const courseDetails = allCourses.find(c => c.courseId === enrollment.courseId);
                      return {
                        ...enrollment,
                        courseCategory: courseDetails?.courseCategory || 'N/A',
                        courseDurationMonths: courseDetails?.courseDurationMonths || 0,
                        instructor: courseDetails?.instructor || 'N/A',
                        startDate: courseDetails?.startDate || 'N/A',
                        endDate: courseDetails?.endDate || 'N/A'
                      };
                    });
                  })
                );
              })
            );
          }),
          catchError((err) => {
            console.error('Error:', err);
            return of([]); // Return an empty array on error
          })
        )
        .subscribe((enrolledCourses) => {
          this.enrolledCourses = enrolledCourses;
          console.log('Enrolled Courses with details:', this.enrolledCourses);
        });
    } else {
      console.error('No logged-in candidate found.');
      this.enrolledCourses = [];
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
