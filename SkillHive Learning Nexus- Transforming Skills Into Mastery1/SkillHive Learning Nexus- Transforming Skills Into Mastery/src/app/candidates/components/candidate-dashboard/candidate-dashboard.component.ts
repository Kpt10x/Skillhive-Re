import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Candidate } from '../../services/candidate.service';  // Assuming you have Candidate model
import { CandidateService } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.css'
})
export class CandidateDashboardComponent implements OnInit {
  user: Candidate | null = null;
  currentUserId!: string;
  isCoursesDropdownVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService
  ) {}
  // constructor(private userService: CandidateService) {}

  ngOnInit(): void {
    // Get the candidate ID from the route parameter
    const candidateId = this.route.snapshot.paramMap.get('id');
    if (candidateId) {
      // Fetch candidate details based on the ID
      this.candidateService.getCandidateById(candidateId).subscribe({
        next: (candidate) => {
          this.user = candidate;
        },
        error: (err) => {
          console.error('Error fetching candidate details:', err);
          // Redirect to login if candidate details cannot be fetched
          this.router.navigate(['/login']);
        },
      });
    } else {
      // Redirect to login if no ID is provided
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.candidateService.clearLoggedInCandidateId();
    sessionStorage.removeItem('loggedInCandidate');
    // Perform other logout logic like redirecting to the login page
  }
  
}

