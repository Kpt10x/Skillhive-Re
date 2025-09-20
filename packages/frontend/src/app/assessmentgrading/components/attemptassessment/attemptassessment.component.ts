import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attempt-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './attemptassessment.component.html',
  styleUrls: ['./attemptassessment.component.css']
})
export class AttemptAssessmentComponent {
  logoPath: string = '../../assets/default-logo.png';
  assessmentTitle: string = 'Assessment Title';
  courses: any[] = [];
  selectedCourseId: string = '';
  isLoadingCourses: boolean = true;
  startDate: Date = new Date('2025-01-25T12:00:00');
  isAcknowledged: boolean = false;
  duration: number = 15;
  numberOfQuestions: number = 10;
  candidateId: string = '';
  isCoursesDropdownVisible: any;

  courseLogos: { [key: string]: string } = {
    'Web Development': 'assets/web-app-dev.png',
    'Data Science': 'assets/data-science.png',
    'Machine Learning': 'assets/machine-learning.png',
    'Business Analytics': 'assets/business-analytics.png',
    'Cloud Computing': 'assets/cloud-service.png',
    'AI for Beginners': 'assets/ai.png',
    'Digital Marketing': 'assets/digital-marketing.png',
    'Cyber Security': 'assets/cyber-security.png',
    'Graphic Design': 'assets/graphic-design.png',
    'Photography Basics': 'assets/photography.png'
  };
  user: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Get both candidate ID and course ID from route parameters
    this.route.params.subscribe(params => {
      this.candidateId = params['candidateId'];
      this.selectedCourseId = params['courseId'];
      this.loadCourses();
      this.loadUser();
    });
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
    this.http.get<any[]>('http://localhost:3000/courses').subscribe(
      (data) => {
        this.courses = data || [];
        this.isLoadingCourses = false;
        this.setAssessment(this.selectedCourseId);
      },
      (error) => {
        console.error('Error loading courses:', error);
        alert('Failed to load courses. Please check your server connection.');
        this.isLoadingCourses = false;
      }
    );
  }

  setAssessment(courseId: string): void {
    const course = this.courses.find(course => course.courseId === courseId);
    if (course) {
      this.assessmentTitle = `${course.courseName} Assessment`;
      this.logoPath = this.courseLogos[course.courseName] || '../../assets/default-logo.png';
    } else {
      this.assessmentTitle = 'Unknown Assessment';
      this.logoPath = '../../assets/default-logo.png';
    }
  }

  
  startTest(): void {
    if (this.isAcknowledged) {
      this.router.navigate(
        ['/mcqtest', this.candidateId, this.selectedCourseId]
      );
    } else {
      alert('Please acknowledge the instructions before starting the test.');
    }
  }
}
