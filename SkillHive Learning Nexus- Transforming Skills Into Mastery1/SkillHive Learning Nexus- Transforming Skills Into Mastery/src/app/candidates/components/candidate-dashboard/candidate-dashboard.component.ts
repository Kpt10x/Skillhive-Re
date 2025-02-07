import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Candidate } from '../../services/candidate.service';  // Assuming you have Candidate model
import { CandidateService } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { EnrolledCoursesComponent } from '../enrolled-courses/enrolled-courses.component';
import { AuthService } from '../../../authentication/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule,EnrolledCoursesComponent,MatButtonModule, MatIconModule],
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
    private candidateService: CandidateService,
    private authService: AuthService 
  ) { }
  // constructor(private userService: CandidateService) {}


    // Get the candidate ID from the route parameter
    ngOnInit(): void {
      const candidateId = this.route.snapshot.paramMap.get('id');
      console.log("Candidate ID:", candidateId);  // Debugging
  
      if (candidateId) {
          this.candidateService.getCandidateById(candidateId).subscribe({
              next: (candidate) => {
                  this.user = candidate;
                  console.log("Fetched Candidate:", this.user);  // Debugging
              },
              error: (err) => {
                  console.error('Error fetching candidate details:', err);
                  this.router.navigate(['/login']);
              },
          });
      } else {
          console.log("No Candidate ID found");
          this.router.navigate(['/login']);
      }
  }
  
  
  // logout(): void {
  //   this.authService.logout();
  // }
  logout() {
    sessionStorage.clear(); // Clear session storage
  
    // Navigate to login page
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        history.pushState(null, '', location.href);
        window.onpopstate = () => {
          history.pushState(null, '', location.href);
        };
      }, 0);
    });
  }
  
}

