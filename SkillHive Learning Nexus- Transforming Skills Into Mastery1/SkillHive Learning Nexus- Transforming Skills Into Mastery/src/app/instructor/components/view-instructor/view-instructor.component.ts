import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-view-instructor',
  standalone: true,
  templateUrl: './view-instructor.component.html',
  styleUrls: ['./view-instructor.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule] // Add FormsModule here
})
export class ViewInstructorComponent implements OnInit {
  instructors: any[] = [];
  editingIndex: number | null = null; // Track the row being edited
  editedInstructor: any = {}; // Temporary storage for edited data

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors(): void {
    this.http.get<any[]>('/assets/data/instructors.json').subscribe({
      next: (data) => {
        this.instructors = data;
        console.log('Instructors loaded:', this.instructors);
      },
      error: (err) => console.error('Error loading instructor data:', err),
    });
  }

  onEdit(index: number): void {
    this.editingIndex = index;
    this.editedInstructor = { ...this.instructors[index] }; // Clone the instructor
  }

  onSave(): void {
    if (this.editingIndex !== null) {
      this.instructors[this.editingIndex] = { ...this.editedInstructor };
      this.editingIndex = null;
      this.editedInstructor = {};
    }
  }

  onCancel(): void {
    this.editingIndex = null;
    this.editedInstructor = {};
  }

  onDelete(index: number): void {
    this.instructors.splice(index, 1);
  }
}
