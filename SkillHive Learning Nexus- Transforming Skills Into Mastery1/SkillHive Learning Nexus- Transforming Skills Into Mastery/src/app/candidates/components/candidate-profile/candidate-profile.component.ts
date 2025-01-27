import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, Candidate } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CandidateProfileComponent implements OnInit {
  student: Candidate | null = null;
  newPassword: string = '';
  newPhoneNumber: string = '';
  userId: string | null = null; // Added to store the current user ID

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch candidateId from route parameters
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.candidateService.getCandidateById(this.userId).subscribe(
        (data) => {
          this.student = data;
        },
        (error) => {
          console.error('Error fetching candidate profile:', error);
        }
      );
    }
  }

  updateProfile(): void {
    if (this.student) {
      const updatedData: Candidate = {
        ...this.student,
        password: this.newPassword || this.student.password,
        phone: this.newPhoneNumber || this.student.phone,
      };

      this.candidateService.updateCandidate(this.student.id, updatedData).subscribe(
        (updatedStudent: Candidate) => {
          this.student = updatedStudent;
          alert('Profile updated successfully!');
          this.newPassword = '';
          this.newPhoneNumber = '';
        },
        (error: any) => {
          console.error('Error updating profile:', error);
          alert('Failed to update profile.');
        }
      );
    }
  }

  navigateTo(route: string): void {
    if (this.userId) {
      this.router.navigate([route, this.userId]);
    }
  }
}
