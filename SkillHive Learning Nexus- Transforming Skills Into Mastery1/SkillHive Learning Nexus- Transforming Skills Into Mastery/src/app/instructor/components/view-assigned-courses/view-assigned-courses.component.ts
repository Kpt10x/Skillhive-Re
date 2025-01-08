import { CommonModule } from '@angular/common';  // Import CommonModule here
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-assigned-courses',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule], 
  templateUrl: './view-assigned-courses.component.html',
  styleUrls: ['./view-assigned-courses.component.css'],
  
})
export class ViewAssignedCoursesComponent implements OnInit {
  courses: any[] = []; // Store the courses fetched from JSON

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch data from the JSON file in the assets folder
    this.http.get<any>('assets/data/assigned-course-data.json').subscribe(
      (data) => {
        this.courses = data.courses; // Assign data to the courses array
      },
      (error) => {
        console.error('Error fetching courses:', error); // Log errors if any
      }
    );
  }
}
