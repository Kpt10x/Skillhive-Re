import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Course {
  courseId: string;
  courseName: string;
  courseCategory: string;
  courseDurationInMonths: number;
  instructorName: string;
  testDate: string;  // Add testDate to the interface
  id: string;
  logoUrl?: string;
  status?: string;  // To store status based on testDate
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Course[]>('http://localhost:3000/courses').subscribe({
      next: (data) => {
        this.courses = data.map(course => ({
          ...course,
          logoUrl: this.getCourseLogo(course),
          status: this.getCourseStatus(course.testDate)  // Assign status based on testDate
        }));

        // Sort courses based on status: Live > Upcoming > Ended
        this.courses.sort((a, b) => this.getStatusPriority(a.status) - this.getStatusPriority(b.status));
      
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

  // Determine the course status based on testDate
  getCourseStatus(testDate: string): string {
    const currentDate = new Date();
    const testDateObj = new Date(testDate);

    if (testDateObj.toDateString() === currentDate.toDateString()) {
      return 'Live';  // If the test date is today
    } else if (testDateObj < currentDate) {
      return 'Ended';  // If the test date is in the past
    } else {
      return 'Upcoming';  // If the test date is in the future
    }
  }

  openCard(course: Course): void {
    if (course.status?.toLowerCase() === 'live') {
      this.router.navigate(['/attemptassessment'], { queryParams: { id: course.courseId } });
    } else {
      alert(`You cannot access this card. The assessment is ${course.status}.`);
    }
  }
  getStatusPriority(status?: string): number {
    switch (status?.toLowerCase()) {
      case 'live':
        return 1; // Highest priority
      case 'upcoming':
        return 2; // Medium priority
      case 'ended':
        return 3; // Lowest priority
      default:
        return 4; // For unknown statuses
    }
  }
  

  getCourseLogo(course: Course): string {
    const logoMap: { [key: string]: string } = {
      'Web Development': 'assets/web-app-dev.png',
      'Data Science': 'assets/data-science.png',
      'Machine Learning': 'assets/machine-learning.png',
      'Business Analytics':'assets/business-analytics.png',
      'Cloud Computing': 'assets/cloud-service.png',
      'AI for Beginners': 'assets/ai.png',
      'Digital Marketing':'assets/digital-marketing.png',
      'Cyber Security': 'assets/cyber-security.png',
      'Graphic Design':'assets/graphic-design.png',
      'Photography Basics':'assets/photography.png',
      'default': 'assets/default-course-logo.png'
    };

    const logoUrl = logoMap[course.courseName] || logoMap['default'];
    return logoUrl;
  }

  filterCourses(): void {
    const searchTextLower = this.searchText.toLowerCase().trim();
    this.filteredCourses = this.courses.filter(course =>
      course.courseName.toLowerCase().includes(searchTextLower) ||
      course.courseId.includes(searchTextLower) 
    );
  }

  getCourseLink(courseId: string): void {
    this.router.navigate(['/attemptassessment'], { queryParams: { id: courseId } });
  }
}
