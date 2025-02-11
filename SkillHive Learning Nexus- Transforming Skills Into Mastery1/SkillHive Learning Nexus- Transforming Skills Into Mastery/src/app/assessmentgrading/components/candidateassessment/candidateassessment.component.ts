import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';


interface Course {
  courseId: string;
  courseName: string;
  courseCategory: string;
  courseDurationInMonths: number;
  instructorName: string;
  assessmentDate: string;
  id: string;
  logoUrl?: string;
  status?: string;
  attempted?: boolean;
}

@Component({
  selector: 'app-candidateassessment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './candidateassessment.component.html',
  styleUrls: ['./candidateassessment.component.css']
})
export class CandidateassessmentComponent implements OnInit {
  searchText: string = '';
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  candidateId: string = '';
  attemptedCourses: Set<string> = new Set();
user: any;
isCoursesDropdownVisible: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Current user:', JSON.parse(sessionStorage.getItem('user') || '{}'));
    this.loadUser();
    this.loadCourses();
  }

  // Fetch user data based on candidateId
  loadUser(): void {
    this.http.get<any[]>('http://localhost:3000/profiles').subscribe({
      next: (profiles) => {
        this.user = profiles.find((c: any) => c.id === this.candidateId && c.role === 'candidate') || { name: 'Unknown Candidate' };
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.user = { name: 'Unknown Candidate' };
      }
    });
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin([
      this.http.get<any[]>('http://localhost:3000/courses-enrolled-by-candidates'),
      this.http.get<any[]>('http://localhost:3000/assessments'),
      this.http.get<any[]>('http://localhost:3000/courses'),
      this.http.get<any[]>('http://localhost:3000/submissions')
    ]).subscribe({
      next: ([enrolledCourses, assessments, allCourses, submissions]) => {
        const candidateCourses = enrolledCourses.filter((ec: any) => ec.candidateId === this.candidateId);
        const enrolledCourseIds = candidateCourses.map((ec: any) => ec.courseId);

        // Get only enabled assessments for enrolled courses
        const candidateAssessments = assessments.filter((a: any) => {
          const course = allCourses.find((c: any) => c.courseId === a.courseId);
          return enrolledCourseIds.includes(a.courseId) && course?.enableAssessment === true;
        });

        // Identify already attempted courses
        submissions.forEach((submission: any) => {
          if (submission.candidateId === this.candidateId) {
            this.attemptedCourses.add(submission.courseId);
          }
        });

        this.courses = candidateAssessments.map((assessment: any) => {
          const courseDetails = allCourses.find((c: any) => c.courseId === assessment.courseId);
          return {
            courseId: assessment.courseId,
            courseName: assessment.courseName,
            courseCategory: courseDetails?.courseCategory || 'N/A',
            courseDurationInMonths: courseDetails?.courseDurationInMonths || 0,
            instructorName: courseDetails?.instructor || 'N/A',
            assessmentDate: assessment.assessmentDate,
            id: assessment.id,
            logoUrl: this.getCourseLogo(courseDetails),
            status: this.getCourseStatus(assessment.assessmentDate),
            attempted: this.attemptedCourses.has(assessment.courseId)
          };
        });

        this.courses.sort((a, b) => this.getStatusPriority(a.status) - this.getStatusPriority(b.status));
        this.filteredCourses = [...this.courses];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.error = 'Failed to load data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getCourseStatus(testDate: string): string {
    const currentDate = new Date();
    const testDateObj = new Date(testDate);
    
    // Reset time parts to compare only dates
    currentDate.setHours(0, 0, 0, 0);
    testDateObj.setHours(0, 0, 0, 0);

    const currentTimestamp = currentDate.getTime();
    const testTimestamp = testDateObj.getTime();

    if (currentTimestamp === testTimestamp) {
      return 'Live';
    } else if (testTimestamp < currentTimestamp) {
      return 'Ended';
    } else {
      return 'Upcoming';
    }
  }

  openCard(course: Course): void {
    if (course.status?.toLowerCase() === 'live' && !course.attempted) {
      this.router.navigate(['/candidateassessment', this.candidateId, 'attemptassessment', course.courseId]);
    } else if (course.attempted) {
      alert(`You have already attempted this test.`);
    } else {
      alert(`You cannot access this test. The assessment is ${course.status}.`);
    }
  }

  getStatusPriority(status?: string): number {
    switch (status?.toLowerCase()) {
      case 'live':
        return 1;
      case 'upcoming':
        return 2;
      case 'ended':
        return 3;
      default:
        return 4;
    }
  }

  getCourseLogo(course: Course): string {
    const logoMap: { [key: string]: string } = {
      'Web Development': 'assets/web-app-dev.png',
      'Data Science': 'assets/data-science.png',
      'Machine Learning': 'assets/machine-learning.png',
      'Business Analytics': 'assets/business-analytics.png',
      'Cloud Computing': 'assets/cloud-service.png',
      'AI for Beginners': 'assets/ai.png',
      'Digital Marketing': 'assets/digital-marketing.png',
      'Cyber Security': 'assets/cyber-security.png',
      'Graphic Design': 'assets/graphic-design.png',
      'Photography Basics': 'assets/photography.png',
      'default': 'assets/default-course-logo.png'
    };
    return logoMap[course.courseName] || logoMap['default'];
  }

  filterCourses(): void {
    const searchTextLower = this.searchText.toLowerCase().trim();
    this.filteredCourses = this.courses.filter(course =>
      course.courseName.toLowerCase().includes(searchTextLower) ||
      course.courseId.includes(searchTextLower)
    );
  }
}
