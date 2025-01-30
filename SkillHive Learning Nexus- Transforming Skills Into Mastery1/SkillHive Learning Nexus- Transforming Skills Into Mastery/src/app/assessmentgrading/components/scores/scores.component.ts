import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {
  quizResults: any; // Holds the quiz data including questions and user responses
  totalQuestions: number = 0; // Total number of questions
  correctAnswers: number = 0; // Number of correct answers
  marksObtained: number = 0; // Total marks obtained
  totalMarks: number = 0; // Maximum possible marks
  

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Access the passed state
    this.quizResults = history.state?.quizResults;

    if (this.quizResults && this.quizResults.questions) {
      this.calculateScores();
    }
  }

  calculateScores(): void {
    const questions = this.quizResults.questions;

    this.totalQuestions = questions.length;
    this.correctAnswers = questions.reduce((count: number, question: any) => {
      return count + (question.userAnswer === question.correctAnswer ? 1 : 0);
    }, 0);

    // Assuming each correct answer carries 1 mark, calculate total marks
    this.totalMarks = questions.reduce((sum: number, question: any) => {
      return sum + (question.marks || 1); // Default 1 mark per question if not specified
    }, 0);

    

    // Marks obtained by the user
    this.marksObtained = questions.reduce((sum: number, question: any) => {
      return sum + (question.userAnswer === question.correctAnswer ? (question.marks || 1) : 0);
    }, 0);
  }
  navigateToAssessment(): void {
    this.router.navigate(['/candidate-assessment']); // Replace with the actual route of the Candidate Assessment page
  }
}
