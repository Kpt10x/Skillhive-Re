import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    role: ['candidate', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  get fullName() {
    return this.registerForm.controls['fullName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  get role() {
    return this.registerForm.controls['role'];
  }

  generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15); 
  }

  submitDetails() {
    if (this.registerForm.valid) {
      const postData = { ...this.registerForm.value };

      if (postData.password !== postData.confirmPassword) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Passwords do not match',
        });
        return;
      }

      const user = {
        id: this.generateRandomId(),
        fullName: postData.fullName ?? '',
        email: postData.email ?? '',
        password: postData.password ?? '',
        role: postData.role ?? 'candidate',
      };

      this.authService.getUserByEmail(user.email).subscribe(
        (existingUsers) => {
          if (existingUsers.length > 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Email is already registered',
            });
          } else {
            this.authService.registerUser(user).subscribe(
              () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Registered successfully',
                });
                this.router.navigate(['login']);
              },
              () => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Something went wrong during registration',
                });
              }
            );
          }
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong during validation',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields correctly',
      });
    }
  }
}
