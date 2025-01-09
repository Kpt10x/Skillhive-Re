import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../services/candidate.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-candidate-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './candidate-registration.component.html',
  styleUrls: ['./candidate-registration.component.scss']
})
export class CandidateRegistrationComponent {
  registrationForm: FormGroup;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)], // Validates a 10-digit phone number
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  register(): void {
    if (this.registrationForm.valid) {
      const { confirmPassword, ...candidate } = this.registrationForm.value;
  
      if (candidate.password !== confirmPassword) {
        this.successMessage = 'Passwords do not match!';
        return;
      }
  
      // Clear any old session data before registering a new candidate
      sessionStorage.removeItem('loggedInCandidate'); // Clear the old session data
      
      this.candidateService.registerCandidate(candidate).subscribe({
        next: (response) => {
          const generatedId = response.id; // Extract the ID from the server response
          this.successMessage = `Registration successful! Your registration ID is ${generatedId}`;
          alert(this.successMessage); // Show alert with registration ID
          this.registrationForm.reset();
  
          // Redirect to the newly registered candidate's dashboard
          this.router.navigate(['/login']);
        },
        error: () => {
          this.successMessage = 'Error in registration.';
        }
      });
    } else {
      this.successMessage = 'Invalid form submission!';
    }
  }
  
}
