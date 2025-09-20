import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-add-course-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RouterModule],
  templateUrl: './add-course-content.component.html',
  styleUrls: ['./add-course-content.component.css'],
})
export class AddCourseContentComponent implements OnInit {
  courseId: string | null = null;
  courseDetails: any = null;
  courseContentForm: FormGroup;
  apiUrlCourses = 'http://localhost:3000/courses'; // Endpoint for courses
  isEditing: boolean = false;
  currentInstructor:string='';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService 
  ) {
    this.courseContentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }
  setCurrentInstructor(): void {
    const loggedInInstructor = JSON.parse(sessionStorage.getItem('loggedInInstructor') || '{}');
    this.currentInstructor = loggedInInstructor.name || 'Instructor'; }
  ngOnInit(): void {
    this.setCurrentInstructor();
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.fetchCourseDetails(this.courseId);
    }
  }

  fetchCourseDetails(courseId: string): void {
    this.http.get<any>(`${this.apiUrlCourses}/${courseId}`).subscribe(
      (course) => {
        this.courseDetails = course;
        this.courseContentForm.patchValue({
          content: course.content
        });
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.courseContentForm.valid) {
      const updatedContent = this.courseContentForm.value.content;
      const updatedCourse = { ...this.courseDetails, content: updatedContent };

      this.http.put(`${this.apiUrlCourses}/${this.courseId}`, updatedCourse).subscribe({
        next: () => {
          alert('Course content updated successfully!');
          this.isEditing = false;
        },
        error: (err) => {
          console.error('Error saving course content:', err);
          alert('Error saving course content.');
        }
      });
    }
  }

  enableEditing(): void {
    this.isEditing = true;
  }
  logout(): void {
    this.authService.logout();
  }
}

