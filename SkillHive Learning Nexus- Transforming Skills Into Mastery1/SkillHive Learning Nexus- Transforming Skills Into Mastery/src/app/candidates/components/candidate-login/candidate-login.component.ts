import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidateService } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './candidate-login.component.html',
  styleUrls: ['./candidate-login.component.css'],
})
export class CandidateLoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private router: Router
  ) {
    // Initialize login form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email should be required and in a valid email format
      password: ['', Validators.required], // Password should be required
    });
  }

  // Handle login form submission
  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.candidateService.authenticateCandidate(email, password).subscribe({
        next: (candidate) => {
          if (candidate) {
            // Store candidate ID in the CandidateService
            sessionStorage.setItem('loggedInCandidate', JSON.stringify(candidate));
            this.candidateService.setLoggedInCandidateId(candidate.id);

            // Navigate to dashboard after successful login
            this.router.navigate([`/dashboard/${candidate.id}`]).then(() => {
              console.log(`Redirected to dashboard of candidate: ${candidate.id}`);
            });
          } else {
            this.loginError = 'Invalid email or password. Please try again.';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.loginError = 'An error occurred during login. Please try again.';
        },
      });
    } else {
      this.loginError = 'Please fill in both fields.';
    }
  }
}
