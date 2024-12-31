import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidateService,Candidate } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CandidateProfileComponent implements OnInit {
  student: Candidate | null = null;
  newPassword: string = '';
  newPhoneNumber: string = '';

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.candidateService.getCandidateById(studentId).subscribe((data: Candidate) => {
        this.student = data;
      });
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
}
