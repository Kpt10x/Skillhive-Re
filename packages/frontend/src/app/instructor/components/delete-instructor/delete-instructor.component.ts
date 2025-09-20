import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-delete-instructor',
  standalone: true,
  templateUrl: './delete-instructor.component.html',
  styleUrls: ['./delete-instructor.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule,RouterModule],
})
export class DeleteInstructorComponent implements OnInit {
  profiles: any[] = [];
  profilesApiUrl = 'http://localhost:3000/profiles';

  constructor(private http: HttpClient, private authService: AuthService ) {}
  isCoursesDropdownVisible=false;
  isInstructorsDropdownVisible=false;
  isCandidateDropdownVisible=false;
  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.http.get<any[]>(this.profilesApiUrl).subscribe((data) => {
      this.profiles = data.filter(profile => profile.role === 'instructor');
    });
  }

  deleteInstructor(id: number): void {
    if (confirm('Are you sure you want to delete this instructor?')) {
      this.http.delete(`${this.profilesApiUrl}/${id}`).subscribe({
        next: () => {
          this.profiles = this.profiles.filter((profile) => profile.id !== id.toString());
          alert('Instructor deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting instructor:', err);
          alert('Failed to delete the instructor. Please try again.');
        },
      });
    }
  }
  logout(): void {
    this.authService.logout();
  }
}

