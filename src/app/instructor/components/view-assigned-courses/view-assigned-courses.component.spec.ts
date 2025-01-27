import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../Models/course.model';

@Component({
  selector: 'app-view-assigned-courses',
  templateUrl: './view-assigned-courses.component.html',
  styleUrls: ['./view-assigned-courses.component.css'],
})
export class ViewAssignedCoursesComponent implements OnInit {
  courses: Course[] = [];
  instructorId = '12345';  // Replace with dynamic ID if needed

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAssignedCourses();
  }

  loadAssignedCourses() {
    this.http.get<Course[]>('http://localhost:3000/courses').subscribe(
      (allCourses) => {
        this.courses = allCourses.filter(course => course.instructorId === this.instructorId);
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
}
