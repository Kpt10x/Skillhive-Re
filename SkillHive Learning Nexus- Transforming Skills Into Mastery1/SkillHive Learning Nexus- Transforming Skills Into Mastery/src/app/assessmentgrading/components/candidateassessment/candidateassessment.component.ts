import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Course {
  id: string;
  name: string;
  status: string;
}

@Component({
  selector: 'app-candidateassessment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidateassessment.component.html',
  styleUrls: ['./candidateassessment.component.css']
})
export class CandidateassessmentComponent implements OnInit {
  searchText: string = '';
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Course[]>('http://localhost:3000/courses').subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = [...this.courses];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'Failed to load courses. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getCourseLink(courseId: string): void {
    const course = this.courses.find(c => c.id === courseId);
    if (course?.status.toLowerCase() === 'live') {
        this.router.navigate(['/attempt-assessment'], { 
            queryParams: { courseId: courseId } 
        });
    } else {
        // Optional: Show a message for non-live courses
        alert('This assessment is not currently available.');
    }
}

  isValidCourse(courseId: string): boolean {
    const course = this.courses.find(c => c.id === courseId);
    return course?.status.toLowerCase() === 'live';
  }

  getStatusClassAndText(status: string): { statusClass: string, statusText: string } {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'live':
        return { statusClass: 'live', statusText: 'Live' };
      case 'upcoming':
        return { statusClass: 'upcoming', statusText: 'Upcoming' };
      case 'completed':
        return { statusClass: 'completed', statusText: 'Completed' };
      default:
        return { statusClass: 'unknown', statusText: 'Unknown' };
    }
  }

  filterCourses(): void {
    if (!this.searchText) {
      this.filteredCourses = [...this.courses];
      return;
    }
    
    const searchTextLower = this.searchText.toLowerCase().trim();
    this.filteredCourses = this.courses.filter(course => 
      course.name.toLowerCase().includes(searchTextLower) || 
      course.id.toLowerCase().includes(searchTextLower)
    );
  }

  retryLoading(): void {
    this.loadCourses();
  }
}