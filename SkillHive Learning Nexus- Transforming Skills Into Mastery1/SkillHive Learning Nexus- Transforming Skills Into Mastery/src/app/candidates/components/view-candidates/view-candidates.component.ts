import { Component, OnInit } from '@angular/core';
import { CandidateService, Candidate } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-candidates.component.html',
  styleUrl: './view-candidates.component.css'
})
export class ViewCandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  // role: string = 'instructor'; // 'admin' or 'instructor'
  // instructorName: string = 'Ishani'; // Set this for the instructor
  
  role: string = 'admin'; // 'admin' or 'instructor'
  instructorName: string = 'John Doe'; // Set this for the instructor

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    if (this.role === 'admin') {
      this.candidateService.getCandidatesForAdmin().subscribe((data) => {
        this.candidates = data;
      });
    } else if (this.role === 'instructor') {
      this.candidateService
        .getCandidatesForInstructor(this.instructorName)
        .subscribe((data) => {
          this.candidates = data;
        });
    }
  }

  deleteCandidate(candidateId: string): void {
    // Assuming you have a method in your service to delete a candidate from the API
    this.candidateService.deleteCandidate(candidateId).subscribe(() => {
      this.candidates = this.candidates.filter((c) => c.id !== candidateId);
    });
  }
}