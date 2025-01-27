import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Course } from '../../Models/course.model';

@Component({
  selector: 'app-view-assigned-courses',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './view-assigned-courses.component.html',
  styleUrls: ['./view-assigned-courses.component.css'],
})
export class ViewAssignedCoursesComponent implements OnInit {
  instructorId = '95133'; // Example dynamic instructor ID
  assignedCourses: Course[] = []; // Array to store courses assigned to the instructor
  apiUrlCourses = 'http://localhost:3000/courses'; // API endpoint for courses

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAssignedCourses();
  }

  fetchAssignedCourses(): void {
    this.http.get<Course[]>(this.apiUrlCourses).subscribe(
      (allCourses) => {
        if (!allCourses || allCourses.length === 0) {
          console.warn('No courses found in the system.');
          return;
        }
        // Filter courses where instructorId matches and handle null values
        this.assignedCourses = allCourses.filter(
          (course) => course.instructorId === this.instructorId
        );
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
}
