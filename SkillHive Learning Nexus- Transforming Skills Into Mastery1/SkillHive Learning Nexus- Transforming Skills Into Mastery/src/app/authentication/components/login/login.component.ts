import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  template: `
    <h1 mat-dialog-title>Error</h1>
    <div mat-dialog-content>
      <p>{{ message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `,
  standalone: true,
  imports: [MatDialogModule],
})
export class ErrorDialogComponent {
  message!: string; 
}

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
              sessionStorage.setItem('user', JSON.stringify(users[0]));
              switch (role) {
                case 'admin':
                  this.router.navigate(['admin-dashboard']);
                  break;
                case 'instructor':
                  this.router.navigate(['instructor-dashboard']);
                  break;
                case 'candidate':
                  this.router.navigate(['candidate-dashboard']);
                  break;
                default:
                  this.showErrorDialog('Invalid role selected.');
              }
            } else {
              this.showErrorDialog('Invalid credentials or role.');
            }
          },
          error: () => {
            this.showErrorDialog('Error connecting to the server.');
          },
        });
    } else {
      this.showErrorDialog('Please fill out the form correctly.');
    }
  }

  onRoleChange(event: Event) {
    const selectedRole = (event.target as HTMLSelectElement).value;
    console.log('Role changed to:', selectedRole);

    this.showRegisterLink = selectedRole === 'candidate';

    this.loginForm.patchValue({ role: selectedRole });
  }

  private showErrorDialog(message: string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent);
    dialogRef.componentInstance.message = message;
  }
}
