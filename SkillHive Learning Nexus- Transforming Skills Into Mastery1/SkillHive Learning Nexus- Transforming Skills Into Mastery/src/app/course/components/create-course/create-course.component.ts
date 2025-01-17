import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClientModule, provideHttpClient } from "@angular/common/http";
import { CourseService } from "../../services/course_service";

@Component({
  selector: "app-create-course",
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: "./create-course.component.html",
  styleUrls: ["./create-course.component.css"],
})
export class CreateCourseComponent implements OnInit {
  createCourseForm: FormGroup;
  instructors: any[] = [];
  filteredInstructors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private http: HttpClient
  ) {
    this.createCourseForm = this.fb.group({
      courseName: ["", [Validators.required, Validators.minLength(3)]],
      // courseId: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{5,10}')]],
      courseCategory: ["", Validators.required],
      courseDurationMonths: [
        "",
        [Validators.required, Validators.min(1), Validators.max(24)],
      ],
      instructorName: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      assignmentDate: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    console.log("being called");
    this.fetchInstructors(); // Fetch instructors from JSON
  }

  fetchInstructors(): void {
    console.log("fetch json data");
    this.http.get<any[]>("http://localhost:3000/instructors").subscribe(
      (data) => {
        console.log(data);
        this.instructors = data;
        this.filteredInstructors = this.instructors;
      },
      (error) => {
        console.error("Error fetching instructors:", error);
      }
    );
  }

  filterByAvailability(): void {
    const startDate = new Date(this.createCourseForm.get("startDate")?.value);
    const endDate = new Date(this.createCourseForm.get("endDate")?.value);

    // Check if both dates are valid and filled
    if (
      this.createCourseForm.get("startDate")?.value &&
      this.createCourseForm.get("endDate")?.value
    ) {
      this.filteredInstructors = this.instructors.filter((instructor) => {
        const instructorStartDate = new Date(instructor.start_date);
        const instructorEndDate = new Date(instructor.end_date);
        return instructorStartDate <= endDate && instructorEndDate >= startDate;
      });

      // If no instructors are available, keep the original list
      if (this.filteredInstructors.length === 0) {
        this.filteredInstructors = this.instructors;
      }
    } else {
      // If either date is not valid or filled, show all instructors
      this.filteredInstructors = this.instructors;
    }
  }

  onSubmit() {
    if (this.createCourseForm.valid) {
      const courseData = this.createCourseForm.value;

      // Directly use the instructor name from the form
      const instructorName = courseData.instructorName;

      // Set the instructor's name in courseData
      courseData.instructorName = instructorName; // Use the name directly

      // Get the selected dates from the form
      const assignmentDate = new Date(courseData.assignmentDate);
      const endDate = new Date(courseData.endDate);

      // Check if the assignment date is before the end date
      if (assignmentDate <= endDate) {
        alert("Assignment date must be before the end date."); // Show error message
        return; // Exit the function if validation fails
      }

      // Save course data using the CourseService
      this.courseService.saveCourse(courseData).subscribe(
        (response) => {
          console.log("Course saved successfully:", response);
          alert("Course details saved successfully!"); // Show success message
          this.createCourseForm.reset(); // Reset the form
          this.filteredInstructors = this.instructors; // Reset filtered instructors to show all options
          this.createCourseForm.get("courseCategory")?.setValue(""); // Reset category selection
          this.createCourseForm.get("instructorName")?.setValue(""); // Reset instructor selection
        },
        (error) => {
          console.error("Error saving course:", error);
          alert("There was an error saving the course details."); // Show error message
        }
      );
    } else {
      alert("Please fill in all required fields correctly."); // Show validation error message
    }
  }

  cancel() {
    // Logic to handle cancellation, e.g., reset the form or navigate away
    this.createCourseForm.reset({
      courseName: "",
      courseCategory: "", // Ensure this is reset to show the placeholder
      courseDurationMonths: "",
      instructorName: "", // Ensure this is reset to show the placeholder
      startDate: "",
      endDate: "",
      assignmentDate: "",
    }); // Reset the form with default values
    this.filteredInstructors = this.instructors; // Reset filtered instructors to show all options
    // Optionally, navigate to another route or perform other actions
  }
}