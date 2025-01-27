import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-all-instructors',
  standalone: true,
  templateUrl: './view-all-instructors.component.html',
  styleUrls: ['./view-all-instructors.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule],
})
export class ViewAllInstructorsComponent implements OnInit {
  instructors: any[] = [];
  filteredInstructors: any[] = [];
  searchQuery: string = '';
  profilesApiUrl = 'http://localhost:3000/profiles'; // JSON server API endpoint
  isEditing: boolean = false;
  selectedInstructor: any = null; // Declare selectedInstructor for editing

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchInstructors();
  }

  fetchInstructors(): void {
    this.http.get<any[]>(this.profilesApiUrl).subscribe(
      (data) => {
        this.instructors = data.filter(profile => profile.role === 'instructor');
        this.filteredInstructors = this.instructors;
      },
      (error) => {
        console.error('Error fetching instructors:', error);
      }
    );
  }

  filterByDetails(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredInstructors = this.instructors.filter((instructor) => {
      return (
        instructor.name.toLowerCase().includes(query) ||
        instructor.email.toLowerCase().includes(query) ||
        instructor.phone.includes(query)
      );
    });
    if (this.filteredInstructors.length === 0) {
      alert('No instructors found matching your search criteria');
    }
  }

  editInstructor(instructor: any): void {
    this.isEditing = true;
    this.selectedInstructor = { ...instructor }; // Clone the instructor object for editing
  }

  updateInstructor(): void {
    if (this.selectedInstructor) {
      const updatedInstructor = this.selectedInstructor;
      this.http.put(`${this.profilesApiUrl}/${updatedInstructor.id}`, updatedInstructor).subscribe(
        () => {
          const index = this.instructors.findIndex((inst) => inst.id === updatedInstructor.id);
          if (index > -1) {
            this.instructors[index] = updatedInstructor;
            this.filteredInstructors = [...this.instructors];
          }
          this.cancelEdit();
          alert('Instructor updated successfully.');
        },
        (error) => {
          console.error('Error updating instructor:', error);
          alert('Failed to update instructor.');
        }
      );
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedInstructor = null;
  }
}
