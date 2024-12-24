import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-create-course',
    templateUrl: './create-course.component.html',
    styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent {
    createCourseForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.createCourseForm = this.fb.group({
            courseName: ['', [Validators.required, Validators.minLength(3)]],
            courseId: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{5,10}')]],
            courseCategory: ['', Validators.required],
            courseDurationMonths: ['', [Validators.required, Validators.min(1), Validators.max(24)]],
            instructorName: ['', [Validators.required, Validators.pattern('[A-Za-z\\s]{3,50}')]],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            assignmentDate: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.createCourseForm.valid) {
            console.log('Form Submitted', this.createCourseForm.value);
        } else {
            console.log('Form is invalid');
        }
    }
}