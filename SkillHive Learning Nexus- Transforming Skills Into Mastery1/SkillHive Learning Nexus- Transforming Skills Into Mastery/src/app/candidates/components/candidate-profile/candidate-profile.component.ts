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
  isCoursesDropdownVisible = false;
  //user: Candidate | null = null;
  // Added to store the current user ID

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch candidateId from route parameters
    // this.userId = this.route.snapshot.paramMap.get('id');
    // console.log(this.userId);
    const loggedInUserId = this.candidateService.getLoggedInCandidateId();
    //const userId = this.candidateService.getLoggedInCandidateId();
    if (loggedInUserId) {
      this.candidateService.getCandidateById(loggedInUserId).subscribe({
        next: (candidate) => {
          this.student = candidate;
        },
        error: (err) => {
          console.error('Error fetching candidate profile:', err);
        },
      });
    } else {
      console.error('No logged-in candidate found.');
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
          this.router.navigate(['/login']);

        },
        (error: any) => {
          console.error('Error updating profile:', error);
          alert('Failed to update profile.');
        }
      );
    }
  }

  // navigateTo(route: string): void {
  //   if () {
  //     this.router.navigate([route, this.loggedInUserId]);
  //   }
  // }
}
