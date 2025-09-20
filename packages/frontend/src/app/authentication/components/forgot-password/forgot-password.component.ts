import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    const email = this.forgotPasswordForm.value.email;

    // Check if email exists in the mock server
    this.http.get<any[]>(`http://localhost:5000/api/profiles?email=${email}`).subscribe((profiles) => {
      if (profiles.length > 0) {
        alert('Password reset link sent to your email (mocked)');
        this.router.navigate(['/reset-password'], { queryParams: { email } });
      } else {
        alert('Email not found. Please try again.');
      }
    });
  }
}
