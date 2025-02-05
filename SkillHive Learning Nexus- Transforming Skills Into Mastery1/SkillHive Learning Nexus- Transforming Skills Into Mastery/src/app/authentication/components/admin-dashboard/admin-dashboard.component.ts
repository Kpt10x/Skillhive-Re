import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { admindashboardService } from "../../services/admin-dashboard.service";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { profiles } from '../../models/interfaces/auth';
import { CourseService } from '../../services/Course.service'; // Import CourseService
import { Course } from '../../../course/models/course_model'; // Import the Course interface
import { ChartComponent } from "../chart/chart.component"; // Import ChartComponent

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, ChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  courses: Course[] = []; // Declare courses as an array of Course
  candidates: any[] = [];
  adminName: string = '';
  isCoursesDropdownVisible = false;
  isInstructorsDropdownVisible = false;
  isCandidateDropdownVisible = false;
  loggedInUser = { role: 'admin' }; // Assume this is fetched from a login mechanism
  activeView: string = 'home';  // Default active view is 'home'

  constructor(
    private candidateService: admindashboardService,
    public authService: AuthService,
    private router: Router,
    private courseService: CourseService // Inject CourseService here
  ) {}

  ngOnInit() {
    this.fetchAdminProfile();
    this.fetchCandidates();
    this.fetchCourses(); // Fetch courses data on init
  }

  private fetchAdminProfile(): void {
    this.authService.getAdminProfile().subscribe(
      (data: profiles[]) => {
        const adminProfile = data.find(profile => profile.role === 'admin');
        if (adminProfile) {
          this.adminName = adminProfile.name;  // Ensure 'name' is part of the profiles interface
        } else {
          console.error('No admin profile found');
        }
      },
      (error: any) => {
        console.error('Error fetching admin profile:', error);
      }
    );
  }

  private fetchCandidates(): void {
    this.candidateService.getAllCandidates().subscribe((data) => {
      this.candidates = data.filter(candidate => candidate.role === 'candidate');

      // Fetch enrolled courses for each candidate
      this.candidates.forEach((candidate) => {
        this.candidateService.getEnrolledCoursesByCandidate(candidate.id).subscribe((courses) => {
          candidate.enrolledCourses = courses;
        });
      });
    });
  }

  private fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data: Course[]) => (this.courses = data),
      error: (err) => console.error('Error fetching courses:', err),
    });
  }
  // Toggle dropdown visibility
  toggleDropdown(dropdown: string): void {
    if (dropdown === 'courses') {
      this.isCoursesDropdownVisible = !this.isCoursesDropdownVisible;
      this.isInstructorsDropdownVisible = false;
      this.isCandidateDropdownVisible = false;
    } else if (dropdown === 'instructors') {
      this.isInstructorsDropdownVisible = !this.isInstructorsDropdownVisible;
      this.isCoursesDropdownVisible = false;
      this.isCandidateDropdownVisible = false;
    } else if (dropdown === 'candidates') {
      this.isCandidateDropdownVisible = !this.isCandidateDropdownVisible;
      this.isCoursesDropdownVisible = false;
      this.isInstructorsDropdownVisible = false;
    }
  }

  // Set the active view
  setActiveView(view: string): void {
    this.activeView = view;
    if (view === 'candidates') {
      this.fetchCandidates(); // Ensure candidate data is fetched when view changes to 'candidates'
    }
  }

  // Delete candidate functionality
  deleteCandidate(id: string): void {
    if (this.loggedInUser.role === 'admin') {
      this.candidateService.deleteCandidate(id).subscribe(() => {
        this.candidates = this.candidates.filter(candidate => candidate.id !== id);
        alert('Candidate deleted successfully');
      });
    } else {
      alert('Only admins can delete candidates.');
    }
  }

  // Logout functionality
  logout() {
    sessionStorage.clear(); // Clear session storage

    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        history.pushState(null, '', location.href);
        window.onpopstate = () => {
          history.pushState(null, '', location.href);
        };
      }, 0);
    });
  }
}
