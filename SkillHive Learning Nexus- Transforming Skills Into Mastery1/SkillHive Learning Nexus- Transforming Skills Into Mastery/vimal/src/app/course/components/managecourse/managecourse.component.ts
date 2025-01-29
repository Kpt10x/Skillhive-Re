import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgSwitchCase } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";

@Component({
  selector: "app-manage-course-instructor",
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: "./managecourse.component.html",
  styleUrls: ["./managecourse.component.css"],
})
export class ManageCourseInstructorComponent implements OnInit {
  selectedStatus: string = ""; // To hold the selected status
  courses: any[] = []; // Initialize courses as an empty array
  filteredCourses: any[] = []; // Add this property

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCourses(); // Fetch courses on component initialization
  }

  fetchCourses() {
    this.http.get<any[]>("http://localhost:3000/courses").subscribe((data) => {
      this.courses = data; // Update courses with fetched data
      this.filteredCourses = data; // Initialize filtered courses
    });
  }

  filterCourses(status: string) {
    if (!status) {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(
        (course) => course.status === status
      );
    }
  }
}