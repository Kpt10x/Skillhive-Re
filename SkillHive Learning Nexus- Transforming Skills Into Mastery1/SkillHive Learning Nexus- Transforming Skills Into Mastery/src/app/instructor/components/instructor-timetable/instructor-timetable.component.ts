import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { Course } from '../../models/course.model';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-instructor-timetable',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule,ReactiveFormsModule],
  templateUrl: './instructor-timetable.component.html',
  styleUrls: ['./instructor-timetable.component.css'],
})
export class InstructorTimeTableComponent implements OnInit {
  assignedCourses: Course[] = [];
  apiUrlCourses = 'http://localhost:3000/courses'; 
  apiUrlAssessments='http://localhost:3000/assessments';
  loggedInInstructor: any = null; // Details of the logged-in instructor
currentInstructor:string='';
  constructor(private http: HttpClient, 
    private instructorService: InstructorService, 
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService ) {}
  
  setCurrentInstructor(): void {
      const loggedInInstructor = JSON.parse(sessionStorage.getItem('loggedInInstructor') || '{}');
      this.currentInstructor = loggedInInstructor.name || 'Instructor'; }
  ngOnInit(): void {
    this.setCurrentInstructor();
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
          (course) => course.instructor && (course.instructor.toLowerCase() === this.loggedInInstructor.name.toLowerCase()));
      },
      (error: any) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  navigateToCourseContent(courseId: string): void {
    this.router.navigate(['/add-course-content', courseId]); 
  }
  

  allowEnroll(courseId: string): void {
    this.http.patch(`http://localhost:3000/courses/${courseId}`, { openForEnrollment: true })
      .subscribe(() => {
        alert('Enrollment allowed for this course!');
        this.fetchAssignedCourses(this.loggedInInstructor.name); // Refresh list
      }, error => {
        console.error('Error updating enrollment status:', error);
      });
  }
  enableAssessment(courseId: string): void {
    const course = this.assignedCourses.find(c => c.courseId === courseId);
    if (course) {
      course.enableAssessment = !course.enableAssessment;
      this.http.put(`${this.apiUrlCourses}/${course.id}`, course).subscribe({
        next: () => {
          alert(`Assessment for course ${course.courseName} is now ${course.enableAssessment ? 'enabled' : 'disabled'}.`);
        },
        error: (err) => {
          console.error('Error updating course:', err);
          alert('Error updating assessment status.');
        }
      });
    } else {
      alert('Course not found.');
    }
  }
  logout(): void {
    this.authService.logout();
  }
}
  
  

