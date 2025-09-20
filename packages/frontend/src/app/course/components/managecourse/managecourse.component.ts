import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren,
} from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CourseService } from "../../services/course_service";
import { Course } from "../../models/course_model"; // Assuming you have a Course model
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormBuilder } from "@angular/forms";
import { FormsModule } from "@angular/forms";
//import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: "manage-course",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: "./managecourse.component.html",
  styleUrls: ["./managecourse.component.css"],
})
export class ManageCourseInstructorComponent implements OnInit, AfterViewInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  uniqueStatuses: string[] = [];
  statusFilter: string = "";
  isCoursesDropdownVisible = false;
  isInstructorsDropdownVisible = false;
  isCandidateDropdownVisible: boolean = false;
  instructors: any[] = [];
  selectedInstructor: string = "";

  @ViewChildren("dropdownBtn") dropdownBtns!: QueryList<ElementRef>;
  @ViewChildren("dropdownContainer") dropdownContainers!: QueryList<ElementRef>;
  selectedCourse: Course | null = null;
  constructor(
    private courseService: CourseService,
    private http: HttpClient,
    private renderer: Renderer2
  ) {
    this.fetchInstructors();
  }

  ngOnInit() {
    this.fetchCourses();
    this.updateSeatsLeft();
  }

  ngAfterViewInit(): void {
    this.dropdownBtns.forEach((btn, index) => {
      if (index >= 1) {
        // Start from "Courses" (index 1), skipping "My Profile"
        btn.nativeElement.addEventListener("click", (event: Event) => {
          event.preventDefault(); // Prevent default anchor behavior
          this.toggleDropdown(index - 1); // Adjust index since My Profile is excluded
        });
      }
    });
  }

  extractUniqueStatuses() {
    //this.uniqueStatuses = [...new Set(this.courses.map((course) => course.status))];
    this.uniqueStatuses = [
      ...new Set(this.courses.map((course) => course.status.toString())),
    ]; // ✅ Ensures all values are string
  }

  fetchCourses() {
    this.http.get("http://localhost:5000/api/courses").subscribe((data: any) => {
      this.courses = data.map((course: any) => ({
        ...course,
        openForEnrollment: course.openForEnrollment ?? false, // Initialize the new attribute
        contentUploaded: course.contentUploaded ?? false, // Initialize contentUploaded attribute
        status: this.updateCourseStatus(course),
        noOfEnrollments: 30, // Set default enrollments to 30
        seatsLeft: 30, // Set default seats left to 30 initially
      }));
      this.filteredCourses = this.courses; // Initialize filtered courses
      this.extractUniqueStatuses(); // Extract unique statuses after loading courses
      this.updateSeatsLeft(); // Update seats left based on the candidates
    });
  }

  // Function to update the status based on start date, end date, and current date
  updateCourseStatus(course: Course): string {
    const currentDate = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (currentDate < startDate) {
      return "Upcoming"; // Course is upcoming
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "Ongoing"; // Course is ongoing
    } else {
      return "Completed"; // Course is completed
    }
  }
  updateSeatsLeft(): void {
    this.http
      .get<any[]>("http://localhost:5000/api/enrollments")
      .subscribe(
        (candidates: any[]) => {
          // Reset seatsLeft for all courses before updating
          this.courses.forEach((course) => {
            course.seatsLeft = 30; // Reset to default before updating
          });

          // Update seats left based on enrolled candidates
          candidates.forEach((candidate: any) => {
            // Match course by courseName and instructorName
            const course = this.courses.find(
              (c) =>
                c.courseName === candidate.courseName &&
                c.instructor === candidate.instructorName
            );

            if (course && course.seatsLeft > 0) {
              course.seatsLeft -= 1; // Reduce available seats per enrolled student
            }
          });

          this.filteredCourses = [...this.courses]; // Refresh UI
        },
        (error) => {
          console.error("Error fetching enrolled candidates:", error);
        }
      );
  }

  enrollCandidate(courseId: string): void {
    this.http
      .post("http://localhost:5000/api/enrollments", {
        courseId,
      })
      .subscribe(() => {
        const course = this.courses.find((c) => c.id === courseId);
        if (course) {
          course.seatsLeft -= 1; // Decrease available seats
        }

        this.filteredCourses = [...this.courses]; // Refresh UI
      });
  }

  toggleDropdown(index: number): void {
    this.dropdownContainers.forEach((container, i) => {
      if (i === index) {
        const isVisible = container.nativeElement.style.display === "block";
        this.renderer.setStyle(
          container.nativeElement,
          "display",
          isVisible ? "none" : "block"
        );
      } else {
        this.renderer.setStyle(container.nativeElement, "display", "none"); // Close other dropdowns
      }
    });
  }

  // filterCoursesByStatus(event: any) {
  //   const selectedStatus = event.target.value;
  //   this.statusFilter = selectedStatus;

  //   // If no status is selected, show all courses
  //   if (selectedStatus === '') {
  //     this.filteredCourses = this.courses;
  //   } else {
  //     this.filteredCourses = this.courses.filter(course => course.status === selectedStatus);
  //   }
  // }

  // Toggle the enrollment status manually
  toggleEnrollment(course: Course): void {
    course.openForEnrollment = !course.openForEnrollment;

    // Update the course status on the server
    this.courseService.updateCourse(course).subscribe(
      (updatedCourse) => {
        console.log("Course enrollment status updated:", updatedCourse);
      },
      (error) => {
        console.error("Error updating course enrollment status", error);
      }
    );
  }

  fetchInstructors() {
    this.http.get<any[]>("http://localhost:5000/api/courses").subscribe((data) => {
      // Extract unique instructor names from courses
      const uniqueInstructors = [
        ...new Set(data.map((course) => course.instructor)),
      ];
      this.instructors = uniqueInstructors.map((name) => ({ name }));
    });
  }

  filterCoursesByInstructor() {
    if (!this.selectedInstructor) {
      this.filteredCourses = [...this.courses]; // Show all courses if no instructor selected
    } else {
      this.filteredCourses = this.courses.filter(
        (course) => course.instructor === this.selectedInstructor
      );
    }
  }
}
