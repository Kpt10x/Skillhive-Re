import { Component, OnInit } from '@angular/core';
import { CandidateService, Candidate } from '../../../candidates/services/candidate.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-view-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule,MatIconModule , MatDialogModule], 
  templateUrl: './view-candidates.component.html',
  styleUrls: ['./view-candidates.component.css']
})
export class ViewCandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  instructorName: string = '';
  currentInstructor: string = '';

  constructor(
    private candidateService: CandidateService,
    private http: HttpClient,
    private router: Router
  ) {
    // Add icons to the library
    // this.library.addIcons(faUsers, faUserPlus, faBook);
  }

  ngOnInit(): void {
    this.setCurrentInstructor();
    this.getCandidatesForInstructor();
  }

  setCurrentInstructor(): void {
    const loggedInInstructor = JSON.parse(sessionStorage.getItem('loggedInInstructor') || '{}');
    this.instructorName = loggedInInstructor.name || '';
    this.currentInstructor = this.instructorName;
  }


  getCandidatesForInstructor(): void {
    if (!this.instructorName) return;

    forkJoin([
      this.http.get<any[]>('http://localhost:3000/courses-enrolled-by-candidates'),
      this.http.get<any[]>('http://localhost:3000/profiles')
    ]).subscribe(([enrolledCourses, profiles]) => {
      // Filter courses by current instructor
      const filteredCourses = enrolledCourses.filter(course => 
        course.instructor === this.instructorName
      );

      // Extract unique candidate IDs (convert to string for matching)
      const candidateIds = [...new Set(filteredCourses.map(course => 
        course.candidateId.toString()
      ))];

      // Match candidate IDs with profile IDs
      this.candidates = profiles.filter(profile => 
        profile.role === 'candidate' && 
        candidateIds.includes(profile.id.toString())
      );
    }, error => {
      console.error('Error fetching data:', error);
    });
  }
}  
