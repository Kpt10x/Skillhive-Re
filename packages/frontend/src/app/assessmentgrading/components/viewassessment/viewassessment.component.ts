import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-viewassessment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Include RouterModule here
  templateUrl: './viewassessment.component.html',
  styleUrls: ['./viewassessment.component.css'],
  providers: [DatePipe]
})
export class ViewassessmentComponent implements OnInit {
  submissions: any[] = [];
  filteredSubmissions: any[] = [];
  profiles: any[] = [];
  selectedCourse: string = 'all';
  candidateNames: { [key: string]: string } = {};
  courses: any[] = [];
  currentInstructor: string = '';
  
  // Define the 'user' property
  user: { id: number, name: string } | null = null; // Example structure
isCoursesDropdownVisible: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadSubmissions();
    this.loadProfiles();
    this.loadCourses();
    this.setCurrentInstructor();
    // Example of how you might load user data
    this.loadUser();
  }

  loadSubmissions() {
    this.http.get<any[]>('http://localhost:5000/api/submissions').subscribe(
      (data) => {
        console.log('Fetched submissions:', data);
        this.submissions = data;
        this.filteredSubmissions = data;
      },
      (error) => {
        console.error('Error fetching submissions:', error);
      }
    );
  }

  loadProfiles() {
    this.http.get<any[]>('http://localhost:5000/api/profiles').subscribe(
      (data) => {
        console.log('Fetched profiles:', data);
        this.profiles = data;
        this.mapCandidateNames();
      },
      (error) => {
        console.error('Error fetching profiles:', error);
      }
    );
  }

  setCurrentInstructor(): void {
    const loggedInInstructor = JSON.parse(sessionStorage.getItem('loggedInInstructor') || '{}');
    this.currentInstructor = loggedInInstructor.name || 'Instructor'; 
  }

  loadCourses() {
    this.http.get<any[]>('http://localhost:5000/api/courses').subscribe(
      (data) => {
        console.log('Fetched courses:', data);
        this.courses = data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  // Example of loading user data, for example from a service
  loadUser() {
    // Simulate fetching user data
    this.user = { id: 1, name: 'John Doe' };  // Example user data
  }

  mapCandidateNames() {
    this.profiles.forEach((profile) => {
      this.candidateNames[profile.id] = profile.name;
    });
  }

  getCandidateName(candidateId: string): string {
    return this.candidateNames[candidateId] || 'Unknown';
  }

  filterSubmissions(event: any) {
    const selectedValue = event.target.value;
    this.selectedCourse = selectedValue;

    if (selectedValue === 'all') {
      this.filteredSubmissions = this.submissions;
    } else {
      this.filteredSubmissions = this.submissions.filter(submission => 
        submission.courseName === selectedValue
      );
    }
  }
  logout(): void {
    this.authService.logout();
  }
}
