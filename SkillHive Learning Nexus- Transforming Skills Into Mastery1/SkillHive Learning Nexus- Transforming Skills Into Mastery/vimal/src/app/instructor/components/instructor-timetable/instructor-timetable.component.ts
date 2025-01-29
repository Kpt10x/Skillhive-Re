import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
// import { AuthService } from '../../../authentication/services/auth.service';
import { RouterModule } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-instructor-timetable',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './instructor-timetable.component.html',
  styleUrls: ['./instructor-timetable.component.css'],
})
export class InstructorTimeTableComponent implements OnInit {
  assignedCourses: Course[] = [];
  apiUrlCourses = 'http://localhost:3000/courses'; // Endpoint for courses
  loggedInInstructor: any = null; // Details of the logged-in instructor

  constructor(private http: HttpClient, private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.loggedInInstructor = JSON.parse(sessionStorage.getItem('loggedInInstructor') || '{}');


     // Retrieve logged-in user from AuthService
    if (this.loggedInInstructor && this.loggedInInstructor.name) {
      this.fetchAssignedCourses(this.loggedInInstructor.name);
    } else {
      console.error('No instructor logged in.');
    }
  }

  fetchAssignedCourses(instructorName: string): void {
    this.http.get<Course[]>(this.apiUrlCourses).subscribe(
      (allCourses) => {
        if (!allCourses || allCourses.length === 0) {
          console.warn('No courses found.');
          return;
        }
        this.assignedCourses = allCourses.filter(
          (course) => course.instructor.toLowerCase() === instructorName.toLowerCase()
        );
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
}
