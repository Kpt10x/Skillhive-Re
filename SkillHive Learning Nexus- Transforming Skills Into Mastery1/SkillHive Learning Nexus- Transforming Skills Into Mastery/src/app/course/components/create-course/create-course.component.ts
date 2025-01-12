import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent {
  createCourseForm: FormGroup;
  instructors = [
    { name: 'John Doe', availability: [['2025-05-01', '2025-09-01']] },
    { name: 'Jane Smith', availability: [['2024-03-01', '2024-04-15']] },
    { name: 'Emily Davis', availability: [['2024-02-10', '2024-03-20']] },
  ];
  filteredInstructors: string[] = [];

  constructor(private fb: FormBuilder) {
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

  filterInstructors() {
    const startDate = this.createCourseForm.get('startDate')?.value;
    const endDate = this.createCourseForm.get('endDate')?.value;

    if (startDate && endDate) {
      this.filteredInstructors = this.instructors
        .filter((instructor) =>
          instructor.availability.some(
            (range) =>
              new Date(startDate) >= new Date(range[0]) && new Date(endDate) <= new Date(range[1])
          )
        )
        .map((instructor) => instructor.name);

      if (this.filteredInstructors.length === 0) {
        alert('No instructors are available for the selected dates.');
      }
    } else {
      alert('Please select both start and end dates.');
    }
  }

  onSubmit() {
    if (this.createCourseForm.valid) {
      console.log('Form Submitted:', this.createCourseForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  cancel() {
    this.createCourseForm.reset();
    this.filteredInstructors = [];
  }
}
function generateCourseId(): void {
    const length: number = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Random length between 5 and 10
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let courseId: string = '';
    for (let i = 0; i < length; i++) {
        courseId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    (document.getElementById('courseId') as HTMLInputElement).value = courseId;
}

