import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule]
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  onSubmit() {
    const { newPassword, confirmPassword } = this.resetPasswordForm.value;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Update password in the mock server
    this.http.get<any[]>(`http://localhost:3000/profiles?email=${this.email}`).subscribe((profiles) => {
      if (profiles.length > 0) {
        const profile = profiles[0];
        this.http
          .patch(`http://localhost:3000/profiles/${profile.id}`, { password: newPassword })
          .subscribe(() => {
            alert('Password updated successfully');
            this.router.navigate(['/login']);
          });
      } else {
        alert('User not found');
      }
    });
  }
}
