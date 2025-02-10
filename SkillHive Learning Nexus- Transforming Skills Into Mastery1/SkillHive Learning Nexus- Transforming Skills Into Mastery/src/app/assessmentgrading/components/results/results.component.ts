import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
 
interface Marksheet {
  id: string;
  candidateId: string;
  courseId: string;
  courseName: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  totalMarks: number;
  submissionDate: string;
  status: string;
}
 
interface Profile {
  id: string;
  name: string;
}
 
@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  candidateId: string = '';
  filteredMarksheets: Marksheet[] = [];
  allMarksheets: Marksheet[] = [];
  profiles: Profile[] = []; 
  isCoursesDropdownVisible = false;
  user: any;
 
  constructor(private http: HttpClient, private route: ActivatedRoute) {}
 
  ngOnInit() {
    this.candidateId = this.route.snapshot.paramMap.get('candidateId') || '';
    if (this.candidateId) {
      this.fetchProfiles();
      this.fetchMarksheets();
      this.loadUser();
    }
  }

  // Fetch user data based on candidateId
  loadUser(): void {
    this.http.get<any[]>('http://localhost:3000/profiles').subscribe({
      next: (profiles) => {
        this.user = profiles.find((c: any) => c.id === this.candidateId && c.role === 'candidate') || { name: 'Unknown Candidate' };
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.user = { name: 'Unknown Candidate' };
      }
    });
  }

 
  fetchProfiles() {
    this.http.get<Profile[]>('http://localhost:3000/profiles').subscribe(data => {
      this.profiles = data;
    });
  }
 
  fetchMarksheets() {
    this.http.get<Marksheet[]>('http://localhost:3000/submissions').subscribe(data => {
      this.allMarksheets = data;
      this.searchMarksheet();
    });
  }
 
  searchMarksheet() {
    this.filteredMarksheets = this.allMarksheets.filter(
      marksheet => marksheet.candidateId === this.candidateId
    );
  }
 
  getCandidateName(candidateId: string): string {
    const profile = this.profiles.find(profile => profile.id === candidateId);
    return profile ? profile.name : `Candidate ${candidateId}`;
  }
 
  calculateGrade(marksObtained: number, totalMarks: number): string {
    const percentage = (marksObtained / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }
}
