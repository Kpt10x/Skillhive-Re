import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Question {
  text: string;
  options: string[];
  isAnswered: boolean;
  isMarked: boolean;
  selectedAnswer?: string;
}

@Component({
  selector: 'app-mcqtest',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mcqtest.component.html',
  styleUrls: ['./mcqtest.component.css']
})
export class McqTestComponent implements OnInit {
  testId: string = '';
  testTitle: string = 'MCQ Test (Set-1)';
  showOverlay: boolean = false;
  showFullscreenModal: boolean = true;
  remainingTime: Date = new Date(0, 0, 0, 0, 30, 0); // 30 minutes
  currentQuestionIndex: number = 0;
  correctMarks: number = 1.00;
  negativeMarks: number = 0.00;
  questions: Question[] = [];
  selectedAnswer?: string;

  // Statistics
  answeredCount: number = 0;
  notAnsweredCount: number = 0;
  notVisitedCount: number = 10;
  markedForReviewCount: number = 0;

  constructor(private route: ActivatedRoute) {
    console.log('MCQ Test Component constructed');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.testId = params['testId'];
      this.loadQuestions();
    });
    this.startTimer();
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  enterFullscreen() {
    document.documentElement.requestFullscreen();
    this.showFullscreenModal = false;
  }

  reportError() {
    // Implement error reporting logic
  }

  viewAllQuestions() {
    // Implement view all questions logic
  }

  onOptionSelect(option: string) {
    if (this.currentQuestion) {
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

  submitQuiz() {
    // Implement submit logic
  }

  private loadQuestions() {
    // Load questions from service
    // This is a placeholder
    this.questions = Array(10).fill(null).map((_, i) => ({
      text: `Question ${i + 1}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      isAnswered: false,
      isMarked: false
    }));
  }

  private updateCounts() {
    this.answeredCount = this.questions.filter(q => q.isAnswered).length;
    this.notAnsweredCount = this.questions.length - this.answeredCount;
    this.markedForReviewCount = this.questions.filter(q => q.isMarked).length;
  }

  private startTimer() {
    const timer = setInterval(() => {
      const time = new Date(this.remainingTime.getTime() - 1000);
      if (time.getTime() <= 0) {
        clearInterval(timer);
        this.submitQuiz();
      } else {
        this.remainingTime = time;
      }
    }, 1000);
  }
}