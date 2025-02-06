import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  admin = {
    name: '',
    email: '',
    password: ''
  };

  adminName = 'Admin'; 
  isCoursesDropdownVisible = false;
  isInstructorsDropdownVisible = false;
  isCandidateDropdownVisible = false;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.admin = profile;
        this.adminName = profile.name;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  updateProfile(): void {
    if (!this.admin.name || !this.admin.email || !this.admin.password) {
      alert('Please fill all required fields.');
      return;
    }

    this.profileService.updateProfile(this.admin).subscribe({
      next: (response) => {
        console.log('Profile updated successfully!', response);
        alert('Profile updated successfully!');
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        console.error('Error updating profile', error);
        alert('Error updating profile.');
      }
    });
  }

  toggleDropdown(section: string): void {
    if (section === 'courses') {
      this.isCoursesDropdownVisible = !this.isCoursesDropdownVisible;
    } else if (section === 'instructors') {
      this.isInstructorsDropdownVisible = !this.isInstructorsDropdownVisible;
    } else if (section === 'candidates') {
      this.isCandidateDropdownVisible = !this.isCandidateDropdownVisible;
    }
  }

  setActiveView(view: string): void {
    this.router.navigate([`/${view}`]);
  }

  logout(): void {
    console.log('Logging out...');
    alert('Logged out successfully!');
    this.router.navigate(['/login']);
  }
}
