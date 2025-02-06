import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, MatDialogModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  showRegisterLink: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['candidate', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, role } = this.loginForm.value;

      this.http
        .get<any[]>('http://localhost:3000/profiles', {
          params: { email, password, role },
        })
        .subscribe({
          next: (users) => {
            if (users.length > 0) {
              const user = users[0]; //object
              sessionStorage.setItem('user', JSON.stringify(user));
              sessionStorage.setItem('loggedInCandidateId', JSON.stringify(user.id)); 
              // If user.id is 123, it's stored as "123" (string)

              this.navigateBasedOnRole(role, user);
            } else {
              this.showErrorAlert('Please check email, password or role.');
            }
          },
          error: () => {
            this.showErrorAlert('Error connecting to the server.');
          },
        });
    } else {
      this.showErrorAlert('Please fill out the form correctly.');
    }
  }

  onRoleChange(event: Event) {
    const selectedRole = (event.target as HTMLSelectElement).value;
    this.showRegisterLink = selectedRole === 'candidate';
    this.loginForm.patchValue({ role: selectedRole });
  }

  private navigateBasedOnRole(role: string, user: any): void {
    switch (role) {
      case 'admin':
        sessionStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['admin-dashboard']);
        break;
      case 'instructor':
        sessionStorage.setItem('loggedInInstructor', JSON.stringify(user));
        sessionStorage.setItem('loggedInInstructorId', JSON.stringify(user.id));
        this.router.navigate(['instructor-dashboard']);
        break;
      case 'candidate':
        sessionStorage.setItem('loggedInCandidate', JSON.stringify(user));
        sessionStorage.setItem('loggedInCandidateId', JSON.stringify(user.id));
        this.router.navigate([`dashboard/${user.id}`]);
        break;
      default:
        this.showErrorAlert('Invalid role selected.');
    }
  }

  private showErrorAlert(message: string): void {
    alert(message); 
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }
  
  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
  

}
