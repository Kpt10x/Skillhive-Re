import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-course',
  templateUrl: './course.html',
  styleUrls: ['./course.css']
})
export class CreateCourseComponent {
  courseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]], // Required and minimum length of 5
      description: ['', [Validators.required, Validators.maxLength(500)]], // Required and max length of 500
      price: ['', [Validators.required, Validators.min(0)]], // Required and positive value
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Form Submitted:', this.courseForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
