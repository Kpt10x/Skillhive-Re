import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CourseService } from '../../services/course_service'; // Import the CourseService

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule,ReactiveFormsModule], // Add HttpClientModule here
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent implements OnInit {
  createCourseForm: FormGroup;
  instructors: any[] = [];
  filteredInstructors: any[] = [];

  // Hardcoded instructor data
  private instructorData = [
    {
      Instructor: "John Doe",
      start_date: "2025-01-01",
      end_date: "2025-06-30"
    },
    {
      Instructor: "Jane Smith",
      start_date: "2025-07-01",
      end_date: "2025-12-31"
    },
    {
      Instructor: "Alice Johnson",
      start_date: "2025-01-15",
      end_date: "2025-05-15"
    },
    {
      Instructor: "Bob Brown",
      start_date: "2025-03-01",
      end_date: "2025-09-30"
    },
    {
      Instructor: "Charlie Black",
      start_date: "2025-02-01",
      end_date: "2025-04-30"
    },
    {
      Instructor: "Diana White",
      start_date: "2025-05-01",
      end_date: "2025-11-30"
    },
    {
      Instructor: "Ethan Green",
      start_date: "2025-08-01",
      end_date: "2025-12-31"
    },
    {
      Instructor: "Fiona Blue",
      start_date: "2025-01-01",
      end_date: "2025-03-31"
    }
  ];

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.createCourseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      courseId: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{5,10}')]],
      courseCategory: ['', Validators.required],
      courseDurationMonths: ['', [Validators.required, Validators.min(1), Validators.max(24)]],
      instructorName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      assignmentDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Use hardcoded data instead of fetching from JSON
    this.instructors = this.instructorData;
    this.filteredInstructors = this.instructors; // Initially show all instructors
  }

  filterByAvailability(): void {
    const startDate = new Date(this.createCourseForm.get('startDate')?.value);
    const endDate = new Date(this.createCourseForm.get('endDate')?.value);

    // Check if both dates are valid
    if (startDate && endDate) {
      this.filteredInstructors = this.instructors.filter((instructor) => {
        const instructorStartDate = new Date(instructor.start_date);
        const instructorEndDate = new Date(instructor.end_date);
        return (
          instructorStartDate <= endDate && instructorEndDate >= startDate
        );
      });
    } else {
      // If dates are not valid, show all instructors
      this.filteredInstructors = this.instructors;
    }
  }

  onSubmit() {
    if (this.createCourseForm.valid) {
      const courseData = this.createCourseForm.value;

      // Save course data using the CourseService
      this.courseService.saveCourse(courseData).subscribe(
        response => {
          console.log('Course saved successfully:', response);
          alert('Course details saved successfully!'); // Show success message
          this.createCourseForm.reset ();
        },
        error => {
          console.error('Error saving course:', error);
          alert('There was an error saving the course details.'); // Show error message
        }
      );
    } else {
      alert('Please fill in all required fields correctly.'); // Show validation error message
    }
  }
  cancel() {
    // Logic to handle cancellation, e.g., reset the form or navigate away
    this.createCourseForm.reset(); // Reset the form
    // Optionally, navigate to another route or perform other actions
  }
}