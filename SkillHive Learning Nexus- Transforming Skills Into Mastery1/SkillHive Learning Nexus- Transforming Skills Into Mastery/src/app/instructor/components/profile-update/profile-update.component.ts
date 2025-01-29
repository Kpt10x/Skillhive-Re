import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../authentication/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css'],
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, RouterModule],
})
export class ProfileUpdateComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  instructorId: string = ''; // ID of the logged-in instructor
  private readonly apiUrl = 'http://localhost:3000/profiles'; // JSON server endpoint

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    // Initialize the profile form with validation rules
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      areaOfExpertise: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(1)]],
    });

    // Initialize the password form with validation rules
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadProfile(); // Load the profile for the logged-in user
  }

  // Load the instructor's profile data from the authentication service
  loadProfile(): any {
const user = JSON.parse(sessionStorage.getItem('loggedInInstructor') || '{}');

    if (!user || user.role !== 'instructor') {
      alert('Error: Unauthorized access. Only instructors can update their profile.');
      this.router.navigate(['/login']);
      return;
    }

    this.instructorId = user.id;
    this.profileForm.patchValue(user); // Populate the form with user data
  }

  // Update the profile data on the JSON server
  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfile = {
        ...this.profileForm.value,
        role: 'instructor', // Ensure the role is not altered
      };
      this.http.put(`${this.apiUrl}/${this.instructorId}`, updatedProfile).subscribe({
        next: () => {
          alert('Profile updated successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert('Failed to update profile. Please try again later.');
        },
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }

  // Update the password on the JSON server
  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;

      this.http.get<any>(`${this.apiUrl}/${this.instructorId}`).subscribe({
        next: (data) => {
          if (data.default_password !== oldPassword) {  // Use default_password from db.json
            alert('Error: Old password is incorrect.');
            return;
          }

          this.http.patch(`${this.apiUrl}/${this.instructorId}`, { default_password: newPassword }).subscribe({
            next: () => {
              alert('Password updated successfully!');
              this.router.navigate(['/dashboard']);
            },
            error: (err) => {
              console.error('Error updating password:', err);
              alert('Failed to update password. Please try again later.');
            },
          });
        },
        error: (err) => {
          console.error('Error verifying old password:', err);
          alert('Failed to verify old password. Please try again later.');
        },
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
