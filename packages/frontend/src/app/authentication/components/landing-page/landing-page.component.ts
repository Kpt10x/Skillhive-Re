import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  profiles: any[] = [];  // Declare a new array for profiles
  courses: any[] = [];  // Declare a new array for courses
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchProfiles();  // Fetch profiles on component initialization
  }

  private fetchProfiles(): void {
    // Fetch profiles from the backend
    this.http.get<any[]>('http://localhost:5000/api/profiles').subscribe(
      (data) => {
        // Filter profiles to include only those with the role of 'Instructor'
        this.profiles = data.filter(profile => profile.role === 'instructor');
      },
      (error) => {
        console.error('Error fetching profiles:', error);
      }
    );
  }
  

  private fetchCourses(): void {
    this.http.get<any[]>('http://localhost:5000/api/courses').subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

}
