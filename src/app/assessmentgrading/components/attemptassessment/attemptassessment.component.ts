import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-attempt-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './attemptassessment.component.html',
  styleUrls: ['./attemptassessment.component.css']
})
export class AttemptAssessmentComponent {
    logoPath: string = 'assets/test-logo.png';
    assessmentTitle: string = 'Data Science Assessment';
    startDate: Date = new Date('2025-01-18T12:00:00');
    endDate: Date = new Date('2025-01-30T12:00:00');
    duration: number = 15;
    numberOfQuestions: number = 10;
    isAcknowledged: boolean = false;
    userName: string = 'User Name'; // Replace with actual user name
  
  courses: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}  // Inject Router in constructor

  ngOnInit() {
    this.loadCourses();
  }

  startTest(): void {
    const now = new Date();

    if (now < this.startDate) {
      alert('The assessment is available from January 18 to January 30, 2025. Please try again later.');
    } else if (now > this.endDate) {
      alert('The assessment period is over. You can no longer access the test.');
    } else {
      console.log('Attempting navigation to MCQ test');
      this.router.navigate(['/mcq-test'], { 
          queryParams: { testId: 'DS001' }
      }).then(() => {
          console.log('Navigation successful');
      }).catch(error => {
          console.error('Navigation failed:', error);
      });
  }
  }

  loadCourses() {
    this.http.get<any>('http://localhost:3000/JSON Server/db.json').subscribe(data => {
      this.courses = data.courses; // Assuming your JSON structure has a 'courses' array
    });
  }

  setAssessment(assessmentId: string) {
    const assessment = this.courses.find(course => course.id === assessmentId);
    if (assessment) {
      this.assessmentTitle = `${assessment.name} (${assessment.id})`;
    } else {
      this.assessmentTitle = 'Unknown Assessment';
    }
  }
}