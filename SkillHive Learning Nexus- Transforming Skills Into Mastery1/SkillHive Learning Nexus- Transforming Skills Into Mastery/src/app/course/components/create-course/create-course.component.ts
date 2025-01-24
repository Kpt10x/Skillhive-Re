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
import { HttpClientModule } from "@angular/common/http";
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
  instructors: any[] = []; // This will be populated with hardcoded data
  filteredInstructors: any[] = [];
  categories: any[] = []; // Array to hold course categories
  minAssignmentDate: string | null = null; // Property to hold the minimum assignment date

  // Hardcoded instructor data with 2025 dates
  hardcodedInstructors: any[] = [
    { id: 1, name: "John Doe", start_date: "2025-01-01", end_date: "2025-12-31", category: "Technology" },
    { id: 2, name: "Jane Smith", start_date: "2025-02-01", end_date: "2025-11-30", category: "Data Analytics" },
    { id: 3, name: "Alice Johnson", start_date: "2025-03-01", end_date: "2025-10-31", category: "Graphic Designing" },
    { id: 4, name: "Bob Brown", start_date: "2025-04-01", end_date: "2025-09-30", category: "Technology" },
  ];

  // Hardcoded category data
  hardcodedCategories: any[] = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Data Analytics" },
    { id: 3, name: "Graphic Designing" },
    { id: 4, name: "Business" },
  ];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private http: HttpClient
  ) {
    this.createCourseForm = this.fb.group({
      courseName: ["", [Validators.required, Validators.minLength(3)]],
      courseCategory: ["", Validators.required],
      courseDurationMonths: [
        "",
        [Validators.required, Validators.min(1), Validators.max(24)],
      ],
      instructorName: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      assignmentDate: ["", Validators.required],
      status: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.filteredInstructors = this.hardcodedInstructors; // Initialize with hardcoded instructors
    this.categories = this.hardcodedCategories; // Initialize with hardcoded categories
  }

  filterInstructors(): void {
    const selectedCategory = this.createCourseForm.get("courseCategory")?.value;
    const startDate = new Date(this.createCourseForm.get("startDate")?.value);
    const endDate = new Date(this.createCourseForm.get("endDate")?.value);

    this.filteredInstructors = this.hardcodedInstructors.filter((instructor) => {
      const instructorStartDate = new Date(instructor.start_date);
      const instructorEndDate = new Date(instructor.end_date);
      const isAvailable = instructorStartDate <= endDate && instructorEndDate >= startDate;
      const isInCategory = selectedCategory ? instructor.category === selectedCategory : true;

      return isAvailable && isInCategory;
    });
  }

  onEndDateChange(): void {
    const endDate = this.createCourseForm.get("endDate")?.value;
    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1); // Set to one day after the end date
      this.createCourseForm.patchValue({
        assignmentDate: endDateObj.toISOString().split("T")[0], // Format to YYYY-MM-DD
      });
      this.minAssignmentDate = endDateObj.toISOString().split("T")[0]; // Update minAssignmentDate
    } else {
      this.minAssignmentDate = null; // Reset if no end date is selected
    }
  }

  onSubmit() {
    if (this.createCourseForm.valid) {
      const courseData = this.createCourseForm.value;

      this.http.post("http://localhost:3000/courses", courseData).subscribe(
        (response) => {
          console.log("Course data saved successfully:", response);
          alert("Course data saved successfully!");
          location.reload();
        },
        (error) => {
          console.error("Error saving course data:", error);
          alert("There was an error saving the course data.");
        }
      );
    } else {
      alert("Please fill in all required fields correctly.");
    }
  }

  cancel() {
    this.createCourseForm.reset();
    this.filteredInstructors = this.hardcodedInstructors; // Reset to all instructors
    this.minAssignmentDate = null; // Reset minimum assignment date
  }
}