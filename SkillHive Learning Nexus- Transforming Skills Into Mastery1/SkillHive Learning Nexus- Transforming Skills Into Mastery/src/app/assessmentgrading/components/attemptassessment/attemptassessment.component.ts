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
    logoPath: string = '../../assets/default-logo.png'; // Default logo path
    assessmentTitle: string = 'Assessment Title'; // Default assessment title
    courses: any[] = []; // Array to store courses data
    selectedCourseId: string = ''; // Store the selected course ID
    isLoadingCourses: boolean = true; // Loading state for courses
    startDate: Date = new Date('2025-01-25T12:00:00');
    isAcknowledged: boolean = false; // Track acknowledgment checkbox state
  duration: number = 15;
  numberOfQuestions: number = 10;

   // Map course names to logo paths
   courseLogos: { [key: string]: string } = {
    'Web Development': 'assets/web-app-dev.png',
      'Data Science': 'assets/data-science.png',
      'Machine Learning': 'assets/machine-learning.png',
      'Business Analytics':'assets/business-analytics.png',
      'Cloud Computing': 'assets/cloud-service.png',
      'AI for Beginners': 'assets/ai.png',
      'Digital Marketing':'assets/digital-marketing.png',
      'Cyber Security': 'assets/cyber-security.png',
      'Graphic Design':'assets/graphic-design.png',
      'Photography Basics':'assets/photography.png'
      
  };

    constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router
    ) {}
  
    ngOnInit() {
      // Load courses from server
      this.loadCourses();
  
      // Get `id` from URL and update the title dynamically
      this.route.queryParams.subscribe((params) => {
        const courseId = params['id'];
        if (courseId) {
          this.selectedCourseId = courseId;
          if (!this.isLoadingCourses) {
            this.setAssessment(courseId);
          }
        }
      });
    }
  
    // Load courses from the server
    loadCourses(): void {
      this.http.get<any[]>('http://localhost:3000/courses').subscribe(
        (data) => {
          this.courses = data || [];
          this.isLoadingCourses = false;
  
          // Set the assessment title based on the current courseId in the URL
          if (this.selectedCourseId) {
            this.setAssessment(this.selectedCourseId);
          }
        },
        (error) => {
          console.error('Error loading courses:', error);
          alert('Failed to load courses. Please check your server connection.');
          this.isLoadingCourses = false;
        }
      );
    }
  
    // Set assessment details dynamically based on course ID
    setAssessment(courseId: string): void {
      const course = this.courses.find((course) => course.courseId === courseId);
      if (course) {
        this.assessmentTitle = `${course.courseName} Assessment `; // Dynamic title
        this.logoPath = this.courseLogos[course.courseName] || '../../assets/default-logo.png'; // Fallback to default logo
      } else {
        this.assessmentTitle = 'Unknown Assessment';
        this.logoPath = '../../assets/default-logo.png';
      }
    }
    startTest(): void {
      if (this.isAcknowledged) {
        this.router.navigate(['/mcqtest'], { queryParams: { testId: this.selectedCourseId } });
      } else {
        alert('Please acknowledge the instructions before starting the test.');
      }
    }}
  // startTest(): void {
  //   if (!this.selectedCourseId) {
  //     alert('Please select a valid course before starting the test.');
  //     return;
  //   }

  //   const now = new Date(); 
  //     this.router.navigate(['mcqtest'], { queryParams: { testId: this.selectedCourseId } });
    
  // }
  // }