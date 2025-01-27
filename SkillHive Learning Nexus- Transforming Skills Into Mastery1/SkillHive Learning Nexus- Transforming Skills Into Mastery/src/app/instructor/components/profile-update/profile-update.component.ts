import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorService } from '../../Services/instructor.service';
import { HttpClientModule } from '@angular/common/http'; // Make sure HttpClientModule is available
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule], // Ensure HttpClientModule is imported
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
  profileForm: FormGroup;
  instructorId: string = ''; // This is fetched from localStorage or session

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      Area_of_Expertise: ['', Validators.required],
      Experience: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Fetch the logged-in instructor's ID (e.g., from localStorage or session)
    this.instructorId = localStorage.getItem('instructorId') || '';
    if (this.instructorId) {
      this.loadProfile();
    } else {
      alert('Error: Could not fetch instructor ID.');
      this.router.navigate(['/login']);
    }
  }

  loadProfile(): void {
    this.instructorService.getInstructorById(this.instructorId).subscribe(
      (data) => {
        this.profileForm.patchValue(data);  // Patch values from response data
      },
      (error) => {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile.');
      }
    );
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      this.instructorService
        .updateInstructor(this.instructorId, this.profileForm.value)
        .subscribe({
          next: () => {
            alert('Profile updated successfully!');
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Error updating profile:', err);
            alert('Failed to update profile.');
          },
        });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
