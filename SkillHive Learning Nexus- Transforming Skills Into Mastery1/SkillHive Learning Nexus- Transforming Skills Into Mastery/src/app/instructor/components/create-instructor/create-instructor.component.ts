import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-instructor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './create-instructor.component.html',
  styleUrls: ['./create-instructor.component.css']
})
export class CreateInstructorComponent implements OnInit {
  createInstructorForm: FormGroup;
  profilesApiUrl = 'http://localhost:3000/profiles';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.createInstructorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      Area_of_Expertise: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.createInstructorForm.valid) {
      if (confirm('Are you sure you want to create this instructor?')) {
        const id = this.generateRandomId();
        const defaultPassword = this.generateRandomPassword();

        const newInstructor = {
          id: id.toString(),
          ...this.createInstructorForm.value,
          role: 'instructor',
          default_password: defaultPassword
        };

        this.http.post(this.profilesApiUrl, newInstructor).subscribe(
          () => {
            alert('Instructor added successfully!');
            this.createInstructorForm.reset();
          },
          (error) => {
            console.error('Error adding instructor:', error);
            alert('Failed to add instructor.');
          }
        );
      }
    } else {
      this.createInstructorForm.markAllAsTouched(); // Highlight validation messages
      alert('Please fill out the form correctly.');
    }
  }

  private generateRandomId(): number {
    return Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  }

  private generateRandomPassword(): string {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}
