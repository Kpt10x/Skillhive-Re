import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-by-course',
  standalone: true,
  templateUrl: './view-by-course.component.html',
  styleUrls: ['./view-by-course.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule],
})
export class ViewByCourseComponent implements OnInit {
  instructors: any[] = [];
  filteredInstructors: any[] = [];
  courses: string[] = [];
  selectedCourse: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/courses').subscribe((data) => {
      // Extracting relevant fields from the response
      this.instructors = data.map((instructor) => ({
        id: instructor.id,
        name: instructor.instructorName,
        course: instructor.courseName, // Directly use courseName
      }));

      // Collect unique courses (trim spaces to avoid mismatches)
      this.courses = [
        ...new Set(
          this.instructors
            .filter((instructor) => instructor.course) // Filter out missing courses
            .map((instructor) => instructor.course.trim())
        ),
      ];

      // Initialize filtered instructors with all data
      this.filteredInstructors = this.instructors;
    });
  }

  // Filter instructors based on selected course
  filterByCourse(): void {
    if (this.selectedCourse) {
      this.filteredInstructors = this.instructors.filter(
        (instructor) => instructor.course.trim() === this.selectedCourse
      );
    } else {
      this.filteredInstructors = this.instructors; // Show all if no course is selected
    }
  }
}
