import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enrolled-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css'],
})
export class EnrolledCoursesComponent implements OnInit {
  id: string = '';
  candidates: any[] = [];
  user: any | undefined;
  enrolledCourses: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    // Extract the user ID from route params
    this.id = this.route.snapshot.paramMap.get('id') || 'u01';
  
    // Fetch data from JSON Server
    this.http.get('http://localhost:3000/candidates').pipe(
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of({ candidates: [] });
      })
    ).subscribe((data: any) => {
      // Check if the data contains candidates
      if (data && Array.isArray(data)) {
        this.candidates = data;
        this.user = this.candidates.find((candidate: any) => candidate.id === this.id);
  
        if (this.user) {
          this.enrolledCourses = this.user.enrolledCourses || [];
        } else {
          console.error(`User with ID ${this.id} not found.`);
        }
      } else {
        console.error('Invalid data format received:', data);
      }
    });
  }
  

  // Add any additional functionality here if needed
}
