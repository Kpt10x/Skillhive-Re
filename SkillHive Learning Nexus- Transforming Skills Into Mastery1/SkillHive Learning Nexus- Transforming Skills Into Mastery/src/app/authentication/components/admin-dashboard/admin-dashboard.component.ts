import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CandidateService } from '../../../candidates/services/candidate.service';
import { admindashboardService } from "../../services/admin-dashboard.service";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  candidates: any[] = [];
  isCoursesDropdownVisible = false;
  isInstructorsDropdownVisible = false;
  isCandidateDropdownVisible: boolean = false;
  loggedInUser = { role: 'admin' }; // Assume this is fetched from a login mechanism.

  constructor(
    private candidateService: admindashboardService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Fetch all candidates
    this.candidateService.getAllCandidates().subscribe((data) => {
      // Filter only candidates by role
      this.candidates = data.filter(candidate => candidate.role === 'candidate');

      // Fetch enrolled courses for each candidate
      this.candidates.forEach((candidate) => {
        this.candidateService.getEnrolledCoursesByCandidate(candidate.id).subscribe((courses) => {
          candidate.enrolledCourses = courses;
        });
      });
    });
  }

  deleteCandidate(id: string) {
    if (this.loggedInUser.role === 'admin') {
      this.candidateService.deleteCandidate(id).subscribe(() => {
        this.candidates = this.candidates.filter(candidate => candidate.id !== id);
        alert('Candidate deleted successfully');
      });
    } else {
      alert('Only admins can delete candidates.');
    }
  }
}
