import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; // Add this import

interface Question {
  text: string;
  options: string[];
  isAnswered: boolean;
  isMarked: boolean;
  selectedAnswer?: string;
  correctAnswer?: string; // Add this
}

interface Course {
  courseId: string;
  courseName: string;
  courseCategory: string;
  courseDurationInMonths: number;
  instructorName: string;
  startDate: string;
  endDate: string;
  testDate: string;
}

@Component({
  selector: 'app-mcqtest',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mcqtest.component.html',
  styleUrls: ['./mcqtest.component.css']
})
export class McqTestComponent implements OnInit, OnDestroy {
  testId: string = '';
  testTitle: string = '';
  courses: Course[] = [];
  showOverlay: boolean = false;
  showFullscreenModal: boolean = true;
  remainingTime: Date = new Date(0, 0, 0, 0, 1, 0); // Initialize with 30 minutes
  currentQuestionIndex: number = 0;
  correctMarks: number = 1.0;
  negativeMarks: number = 0.0;
  questions: Question[] = [];
  selectedAnswer?: string;
  quizResults: any;

  // Statistics
  answeredCount: number = 0;
  notAnsweredCount: number = 0;
  notVisitedCount: number = 0;
  markedForReviewCount: number = 0;

  private timerInterval: any;
  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router // Add Router to constructor
  ) {
    console.log('MCQ Test Component constructed');
  }
 

  ngOnInit() {
    this.http.get<Course[]>('http://localhost:3000/courses').subscribe((data) => {
      this.courses = data;

      this.route.queryParams.subscribe((params) => {
        this.testId = params['testId'];

        const course = this.courses.find((c) => c.courseId === this.testId);
        this.testTitle = course ? course.courseName : 'MCQ Test';
      });

      this.loadQuestions();
    });

    this.startTimer();
  }

  ngOnDestroy() {
    // Clear the timer interval when the component is destroyed
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  enterFullscreen() {
    document.documentElement.requestFullscreen();
    this.showFullscreenModal = false;
  }

  reportError() {
    // Error reporting logic here
  }

  viewAllQuestions() {
    // View all questions logic
  }

  onOptionSelect(option: string) {
    if (this.currentQuestion) {
      this.selectedAnswer = this.selectedAnswer === option ? '' : option;
      this.currentQuestion.selectedAnswer = option;
      this.currentQuestion.isAnswered = true;
      this.updateCounts();
    }
  }

  markForReview() {
    if (this.currentQuestion) {
      this.currentQuestion.isMarked = true;
      this.updateCounts();
    }
    this.goToNext();
  }

  clearResponse() {
    if (this.currentQuestion) {
      this.selectedAnswer = ''; // Clear the selected answer
      this.currentQuestion.selectedAnswer = undefined;
      this.currentQuestion.isAnswered = false;
      this.updateCounts();
    }
  }

  saveAndNext() {
    this.goToNext();
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  goToNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  
  private loadQuestions() {
    this.http.get<any[]>('http://localhost:3000/assessments').subscribe((data) => {
      const course = data.find((c) => c.courseId === this.testId);
      if (course) {
        this.questions = course.questions.map((q: any) => ({
          text: q.question,
          options: q.options,
          correctAnswer: q.answer, // Fetch correct answer
          isAnswered: false,
          isMarked: false,
        }));
        this.notVisitedCount = this.questions.length;
        this.updateCounts(); // Initialize counts
      } else {
        console.error('Assessment not found');
      }
    });
  }

  private updateCounts() {
    this.answeredCount = this.questions.filter((q) => q.isAnswered).length;
    this.notAnsweredCount = this.questions.length - this.answeredCount;
    this.markedForReviewCount = this.questions.filter((q) => q.isMarked).length;
    this.notVisitedCount = this.questions.length - this.answeredCount - this.markedForReviewCount;
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.remainingTime = new Date(this.remainingTime.getTime() - 1000);
      
      // Extract hours, minutes, seconds
      const hours = this.remainingTime.getUTCHours();
      const minutes = this.remainingTime.getUTCMinutes();
      const seconds = this.remainingTime.getUTCSeconds();
  
      // Check if time is up
      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
  }

  submitQuiz() {
    // Exit fullscreen mode if active
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  
    const quizResults = {
      courseId: this.testId,
      courseName: this.testTitle,
      totalQuestions: this.questions.length,
      answeredQuestions: this.answeredCount,
      correctAnswers: this.calculateCorrectAnswers(),
      totalMarks: this.calculateTotalMarks(),
    };
  
    this.router.navigate(['/scores'], {
      state: { quizResults },
    });
  }
  

private calculateCorrectAnswers(): number {
  // This assumes you'll add a 'correctAnswer' property to your Question interface
  return this.questions.filter(q => 
    q.isAnswered && q.selectedAnswer === q.correctAnswer
  ).length;
}

private calculateTotalMarks(): number {
  const correctAnswers = this.calculateCorrectAnswers();
  const incorrectAnswers = this.questions.filter(q => 
    q.isAnswered && q.selectedAnswer !== q.correctAnswer
  ).length;

  return (correctAnswers * this.correctMarks) ;
}

}