import { Component, OnInit } from '@angular/core';
import { CandidateService, Candidate } from '../../../candidates/services/candidate.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUsers, faUserPlus, faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],  // Add FontAwesomeModule to imports
  templateUrl: './view-candidates.component.html',
  styleUrls: ['./view-candidates.component.css']
})
export class ViewCandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  instructorName: string | null = '';
  role: string | null = '';
  isSidebarExpanded: boolean = false; // Track sidebar state
  isCollapsed: boolean = false; // Track collapse state

  constructor(
    private library: FaIconLibrary, 
    private candidateService: CandidateService, 
    private router: Router
  ) {
    // Add icons to the library
    this.library.addIcons(faUsers, faUserPlus, faBook);
  }

  ngOnInit(): void {
    const loggedInUserId = sessionStorage.getItem('loggedInCandidate');
    
    if (loggedInUserId) {
      this.candidateService.getInstructorProfileById(loggedInUserId).subscribe((profile) => {
        if (profile.role === 'instructor') {
          this.instructorName = profile.fullName;
          this.getCandidatesForInstructor();
        } else {
          // Redirect or show error as the user is not an instructor
        }
      });
    }
  }

  getCandidatesForInstructor(): void {
    if (this.instructorName) {
      this.candidateService.getCandidatesByInstructor(this.instructorName).subscribe((candidates) => {
        this.candidates = candidates;
      });
    }
  }
}
