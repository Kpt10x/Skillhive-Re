import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Question {
  text: string;
  options: string[];
  isAnswered: boolean;
  isMarked: boolean;
  isVisited: boolean;
  selectedAnswer?: string;
  correctAnswer?: string;
}

interface Course {
  courseId: string;
  courseName: string;
  assessmentDate: string;
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
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  candidateId: string = '';
  showFullscreenModal: boolean = true;
  showOverlay: boolean = true;
  remainingTime: Date = new Date(0, 0, 0, 0, 15, 0);
  private timerInterval: any;
  private isQuizSubmitted: boolean = false;
  

  answeredCount: number = 0;
  notAnsweredCount: number = 0;
  notVisitedCount: number = 0;
  markedForReviewCount: number = 0;
  correctMarks: number = 1;
  negativeMarks: number = 0;
  selectedAnswer?: string;
user: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.candidateId = params['candidateId'];
      this.testId = params['testId'];
      
      this.http.get<Course[]>('http://localhost:3000/courses').subscribe(data => {
        const course = data.find(c => c.courseId === this.testId);
        this.testTitle = course ? course.courseName : 'MCQ Test';
        this.loadQuestions();
      });
    });
    this.startTimer();
    this.enterFullscreen();
    this.addFullscreenChangeListener();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.removeFullscreenChangeListener();
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  loadQuestions() {
    this.http.get<any[]>('http://localhost:3000/assessments').subscribe(data => {
      const assessment = data.find(a => a.courseId === this.testId);
      if (assessment) {
        this.questions = assessment.questions.map((q: any) => ({
          text: q.question,
          options: q.options,
          correctAnswer: q.answer,
          isAnswered: false,
          isMarked: false,
          isVisited: false,
        }));
        this.notVisitedCount = this.questions.length;

        if (this.questions.length > 0) {
          this.questions[0].isVisited = true;
          this.notVisitedCount--;
        }
        this.updateCounts();
      }
    });
  }

  onOptionSelect(option: string) {
    if (this.currentQuestion) {
      this.currentQuestion.selectedAnswer = option;
      this.currentQuestion.isAnswered = true;
      this.selectedAnswer = option;
      this.updateCounts();
    }
  }

  markForReview() {
    if (this.currentQuestion) {
      this.currentQuestion.isMarked = true;
      // If an option is selected, mark it as answered too
    if (this.currentQuestion.selectedAnswer) {
      this.currentQuestion.isAnswered = true;
    }
      this.updateCounts();
    }
    this.saveAndNext();
  }

  clearResponse() {
    if (this.currentQuestion) {
      this.currentQuestion.selectedAnswer = undefined; // Set to undefined
      this.currentQuestion.isAnswered = false;
      this.currentQuestion.isMarked = false;
      this.selectedAnswer = undefined; // Reset selectedAnswer
      this.updateCounts();
    }
  }
  

  saveAndNext() {
    if (this.currentQuestion) {
      if (this.currentQuestion.selectedAnswer) {
        this.currentQuestion.isAnswered = true;
        this.currentQuestion.isMarked = false; // Remove mark for review if answered
      }
  
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        if (!this.questions[this.currentQuestionIndex].isVisited) {
          this.questions[this.currentQuestionIndex].isVisited = true;
          this.notVisitedCount--;
        }
      }
  
      this.updateCounts();
    }
  }
  

  goToQuestion(index: number) {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;

      if (!this.questions[index].isVisited) {
        this.questions[index].isVisited = true;
        this.notVisitedCount--;
      }
    }
  }

  private updateCounts() {
    this.answeredCount = this.questions.filter(q => q.isAnswered).length;
    this.markedForReviewCount = this.questions.filter(q => q.isMarked && !q.isAnswered).length;
    this.notAnsweredCount = this.questions.filter(q => !q.isAnswered && !q.isMarked).length;
  }
  

  private startTimer() {
    let totalSeconds = 15 * 60;
    this.timerInterval = setInterval(() => {
      totalSeconds--;
      this.remainingTime = new Date(0, 0, 0, 0, Math.floor(totalSeconds / 60), totalSeconds % 60);
      if (totalSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
  }

  enterFullscreen() {
    this.showFullscreenModal = false;
    this.showOverlay = false;
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  addFullscreenChangeListener() {
    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
  }

  removeFullscreenChangeListener() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
  }

  onFullscreenChange() {
    if (!document.fullscreenElement && !this.isQuizSubmitted) {
      alert('You have exited fullscreen mode. Your test will now be submitted.');
      this.submitQuiz();
    }
  }

  submitQuiz() {
    if (this.isQuizSubmitted) return;

    this.isQuizSubmitted = true;

    const quizResults = {
      candidateId: this.candidateId,
      courseId: this.testId,
      courseName: this.testTitle,
      totalQuestions: this.questions.length,
      answeredQuestions: this.answeredCount,
      correctAnswers: this.calculateCorrectAnswers(),
      totalMarks: this.calculateTotalMarks(),
      submissionDate: new Date().toISOString(),
      status: 'Submitted',
    };

    console.log('Submitting results:', quizResults);

    this.http.post('http://localhost:3000/submissions', quizResults).subscribe(
      (response) => {
        console.log('Submission successful:', response);
        alert('Your test has been submitted successfully.');
        this.router.navigate(['/scores', this.candidateId], { state: { quizResults } });
      },
      (error) => {
        console.error('Submission error:', error);
        alert('Failed to submit the quiz. Please try again.');
      }
    );
  }

  private calculateCorrectAnswers(): number {
    return this.questions.filter(q => 
      q.isAnswered && q.selectedAnswer === q.correctAnswer
    ).length;
  }

  private calculateTotalMarks(): number {
    return this.calculateCorrectAnswers() * this.correctMarks;
  }
}
