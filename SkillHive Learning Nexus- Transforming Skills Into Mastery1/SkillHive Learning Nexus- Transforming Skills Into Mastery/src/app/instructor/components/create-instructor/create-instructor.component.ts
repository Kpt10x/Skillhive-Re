import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-instructor',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-instructor.component.html',
  styleUrls: ['./create-instructor.component.css'],
})
export class CreateInstructorComponent implements OnInit {
  createInstructorForm: FormGroup; // Form group for managing the instructor form
  instructors: any[] = []; 
  editingIndex: number | null = null; 

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize the reactive form with validators
    this.createInstructorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      subject: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(1)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Fetch initial instructor data from a JSON file (or an API in a real scenario)
    this.http.get<any[]>('assets/data/instructors.json').subscribe(
      (data) => {
        this.instructors = data;
      },
      (error) => {
        console.error('Error loading instructor data:', error);
      }
    );
  }

  /**
   * Handles form submission for both adding and editing instructors
   */
  onSubmit(): void {
    if (this.createInstructorForm.valid) {
      const formData = this.createInstructorForm.value;

      if (this.editingIndex !== null) {
        // Update existing instructor if in edit mode
        this.instructors[this.editingIndex] = formData;
        this.editingIndex = null; // Reset editing index
        alert('Instructor updated successfully!');
      } else {
        // Add a new instructor
        this.instructors.push({ id: this.instructors.length + 1, ...formData });
        alert('Instructor added successfully!');
      }

      // Reset the form after submission
      this.createInstructorForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }

  /**
   * Loads instructor data into the form for editing
   */
  onEdit(index: number): void {
    const instructor = this.instructors[index];
    this.createInstructorForm.setValue({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      subject: instructor.subject,
      experience: instructor.experience,
    });
    this.editingIndex = index; // Set the editing index
  }

  /**
   * Deletes an instructor from the list
   */
  onDelete(index: number): void {
    if (confirm('Are you sure you want to delete this instructor?')) {
      this.instructors.splice(index, 1);
      alert('Instructor deleted successfully!');
    }
  }
}
