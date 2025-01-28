import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgSwitchCase } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";

@Component({
  selector: "app-adminveiw",
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: "./adminveiw.component.html",
  styleUrls: ["./adminveiw.component.css"],
})
export class AdminveiwComponent implements OnInit {
  selectedStatus: string = ""; // To hold the selected status
  courses: any[] = []; // Initialize courses as an empty array
  filteredCourses: any[] = [];
  uniqueStatuses: string[] = []; // {{ edit_1 }}

  constructor(private http: HttpClient, private router: Router) {
    this.fetchCourses(); // Fetch courses on initialization
  }

  ngOnInit() {
    this.filteredCourses = this.courses; // Initially show all courses
    this.extractUniqueStatuses(); // {{ edit_2 }}
  }

  extractUniqueStatuses() {
    // {{ edit_3 }}
    this.uniqueStatuses = [
      ...new Set(this.courses.map((course) => course.status)),
    ]; // Extract unique statuses
  }

  fetchCourses() {
    this.http.get("http://localhost:3000/courses").subscribe((data: any) => {
      this.courses = data; // Store fetched courses
      this.filteredCourses = this.courses; // Initialize filtered courses
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
    this.extractUniqueStatuses(); // Update unique statuses after filtering
    this.displayFilteredCourseIds(); // Call to display filtered course IDs
  }

  displayFilteredCourseIds() {
    // {{ edit_2 }}
    const courseIds = this.filteredCourses.map((course) => course.id); // Get IDs of filtered courses
    console.log("Filtered Course IDs:", courseIds); // Display in console or update a property to show in HTML
  }

  onEdit(courseId: number) {
    // Fetch course data from the local array
    const courseData = this.courses.find((course) => course.id === courseId);

    // Redirect to create-course page with course ID in the URL and course data in navigation state
    this.router.navigate([`/create-course/${courseId}`], {
      state: { courseData },
    }); // Pass course data in navigation state
  }

  updateCourse(courseId: number, updatedData: any) {
    // Update the course in the local array
    const index = this.courses.findIndex((course) => course.id === courseId);
    if (index !== -1) {
      this.courses[index] = { ...this.courses[index], ...updatedData }; // Update the course data
      this.filteredCourses = [...this.courses]; // Refresh filtered courses
    }

    // Send a PUT request to the backend to update the course in the JSON file
    this.http
      .put(`http:localhost:3000/courses/${courseId}`, updatedData)
      .subscribe(
        (response) => {
          console.log("Course updated successfully", response);
        },
        (error) => {
          console.error("Error updating course", error);
        }
      );
  }

  deleteCourse(courseId: number) {
    // Remove the course from the local array
    this.courses = this.courses.filter((course) => course.id !== courseId);
    this.filteredCourses = this.filteredCourses.filter(
      (course) => course.id !== courseId
    ); // Update filtered courses

    // Send a DELETE request to the backend to remove the course from the JSON file
    this.http.delete(`http://localhost:3000/courses/${courseId}`).subscribe(
      (response) => {
        console.log("Course deleted successfully", response);
      },
      (error) => {
        console.error("Error deleting course", error);
      }
    );
  }
}