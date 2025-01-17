import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgSwitchCase } from '@angular/common';
@Component({
  selector: 'app-manage-course-instructor',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './managecourse.component.html',
  styleUrls: ['./managecourse.component.css']
})
export class ManageCourseInstructorComponent {
  selectedStatus: string = ''; // To hold the selected status
  courses = [
    { category: 'Web Development', name: 'HTML & CSS Basics', trainer: 'John Doe', startDate: '2023-10-01', endDate: '2023-10-30', enrollments: 25, seatsLeft: 5, status: 'Open' },
    { category: 'Data Science', name: 'Introduction to Python', trainer: 'Jane Smith', startDate: '2023-09-01', endDate: '2023-09-30', enrollments: 30, seatsLeft: 0, status: 'Closed' },
    { category: 'Graphic Design', name: 'Photoshop Basics', trainer: 'Emily Johnson', startDate: '2023-11-01', endDate: '2023-11-30', enrollments: 20, seatsLeft: 15, status: 'Upcoming' },
    { category: 'Marketing', name: 'Digital Marketing 101', trainer: 'Michael Brown', startDate: '2023-10-15', endDate: '2023-11-15', enrollments: 10, seatsLeft: 10, status: 'Open' },
    { category: 'Business', name: 'Business Analytics', trainer: 'Sarah Wilson', startDate: '2023-08-01', endDate: '2023-08-30', enrollments: 15, seatsLeft: 0, status: 'Closed' }
  ];

  // Method to filter courses based on selected status
  get filteredCourses() {
    if (!this.selectedStatus) {
      return this.courses; // Return all courses if no filter is selected
    }
    return this.courses.filter(course => course.status === this.selectedStatus);
  }
}