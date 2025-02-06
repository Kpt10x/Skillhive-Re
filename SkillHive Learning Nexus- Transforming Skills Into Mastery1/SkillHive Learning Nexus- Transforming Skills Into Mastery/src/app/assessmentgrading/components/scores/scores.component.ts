import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {
  quizResults: any;
  totalQuestions: number = 0;
  correctAnswers: number = 0;
  marksObtained: number = 0;
  totalMarks: number = 0;
  candidateId: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('candidateId');
    this.quizResults = history.state?.quizResults;

    if (this.quizResults?.questions) {
      this.calculateScores();
    }
  }

  calculateScores(): void {
    const questions = this.quizResults.questions;

    this.totalQuestions = questions.length;
    this.correctAnswers = questions.reduce(
      (count: number, question: any) => count + (question.userAnswer === question.correctAnswer ? 1 : 0),
      0
    );

    this.totalMarks = questions.reduce(
      (sum: number, question: any) => sum + (question.marks || 1),
      0
    );

    this.marksObtained = questions.reduce(
      (sum: number, question: any) => sum + (question.userAnswer === question.correctAnswer ? (question.marks || 1) : 0),
      0
    );
  }

  navigateToAssessment(): void {
    if (this.candidateId) {
      this.router.navigate(['/candidateassessment', this.candidateId]);
    } else {
      console.error('Candidate ID not found');
      this.router.navigate(['/landing-page']);
    }
  }
}
