import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CandidateService, Candidate } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enrolled-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css'],
})
export class EnrolledCoursesComponent implements OnInit {
  enrolledCourses: any[] = [];
  user: Candidate | null = null;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fetch the logged-in candidate's ID
    const loggedInUserId = this.candidateService.getLoggedInCandidateId();

    if (loggedInUserId) {
      this.candidateService.getCandidateById(loggedInUserId).subscribe({
        next: (candidate) => {
          this.user = candidate;
          this.enrolledCourses = candidate.enrolledCourses || [];
        },
        error: (err) => {
          console.error('Error fetching logged-in candidate:', err);
          this.enrolledCourses = []; // Reset in case of error
        },
      });
    } else {
      console.error('No logged-in candidate found.');
      this.enrolledCourses = []; // Reset if no candidate is logged in
    }
  }
}
