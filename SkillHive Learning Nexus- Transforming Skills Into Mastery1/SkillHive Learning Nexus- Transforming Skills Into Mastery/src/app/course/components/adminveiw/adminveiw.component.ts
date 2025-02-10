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
import { Course } from "../../models/course_model";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormBuilder } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "admin-view",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: "./adminveiw.component.html",
  styleUrls: ["./adminveiw.component.css"],
})
export class AdminViewComponent implements OnInit, AfterViewInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  uniqueStatuses: string[] = [];
  statusFilter: string = "";
  isCoursesDropdownVisible = false;
  isInstructorsDropdownVisible = false;
  isCandidateDropdownVisible: boolean = false;

  @ViewChildren("dropdownBtn") dropdownBtns!: QueryList<ElementRef>;
  @ViewChildren("dropdownContainer") dropdownContainers!: QueryList<ElementRef>;
  selectedCourse: Course | null = null;

  constructor(
    private courseService: CourseService,
    private http: HttpClient,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchCourses();
  }

  ngAfterViewInit(): void {
    this.dropdownBtns.forEach((btn, index) => {
      if (index >= 1) {
        btn.nativeElement.addEventListener("click", (event: Event) => {
          event.preventDefault();
          this.toggleDropdown(index - 1);
        });
      }
    });
  }

  fetchCourses() {
    this.http.get("http://localhost:3000/courses").subscribe((data: any) => {
      this.courses = data.map((course: any) => ({
        ...course,
        openForEnrollment: course.openForEnrollment ?? false,
        contentUploaded: course.contentUploaded ?? false,
        status: this.updateCourseStatus(course),
        noOfEnrollments: 30,
        seatsLeft: 30,
      }));

      this.filteredCourses = [...this.courses];
      this.extractUniqueStatuses();

      // ✅ Ensure `updateSeatsLeft()` runs **after** courses are loaded
      setTimeout(() => {
        this.updateSeatsLeft();
      }, 500);
    });
  }

  updateCourseStatus(course: Course): string {
    const currentDate = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (currentDate < startDate) {
      return "Upcoming";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "Ongoing";
    } else {
      return "Completed";
    }
  }

  updateSeatsLeft(): void {
    this.http
      .get<any[]>("http://localhost:3000/courses-enrolled-by-candidates")
      .subscribe(
        (candidates: any[]) => {
          console.log("Fetched enrolled candidates:", candidates); // ✅ Debugging log

          this.courses.forEach((course) => {
            course.seatsLeft = 30;
          });

          candidates.forEach((candidate: any) => {
            const course = this.courses.find(
              (c) =>
                c.courseName.trim().toLowerCase() ===
                  candidate.courseName.trim().toLowerCase() &&
                c.instructor.trim().toLowerCase() ===
                  candidate.instructorName.trim().toLowerCase()
            );

            if (course && course.seatsLeft > 0) {
              course.seatsLeft -= 1;
            }
          });

          console.log("Updated courses with seatsLeft:", this.courses); // ✅ Debugging log
          this.filteredCourses = [...this.courses];
        },
        (error) => {
          console.error("Error fetching enrolled candidates:", error);
        }
      );
  }
  extractUniqueStatuses(): void {
    const statuses = new Set(this.courses.map((course) => course.status));
    this.uniqueStatuses = Array.from(statuses);
  }

  enrollCandidate(courseId: string): void {
    this.http
      .post("http://localhost:3000/enroll", { courseId })
      .subscribe(() => {
        console.log(`Enrolled in course ID: ${courseId}`);
        this.updateSeatsLeft();
      });
  }

  deleteCourse(courseId: string): void {
    this.courseService.deleteCourse(courseId).subscribe(
      (response) => {
        console.log("Course deleted successfully", response);
        this.courses = this.courses.filter((c) => c.id !== courseId);
        this.filteredCourses = [...this.courses];
      },
      (error) => {
        console.error("Error deleting course", error);
      }
    );
  }

  editCourse(courseId: string): void {
    const course = this.courses.find((c) => c.id === courseId);
    this.selectedCourse = course || null;
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
        this.renderer.setStyle(container.nativeElement, "display", "none");
      }
    });
  }

  filterCoursesByStatus(event: any) {
    const selectedStatus = event.target.value;
    this.statusFilter = selectedStatus;

    if (selectedStatus === "") {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(
        (course) => course.status === selectedStatus
      );
    }
  }

  contentUploaded(course: Course): void {
    course.contentUploaded = true;
    course.openForEnrollment = true;

    this.courseService.updateCourse(course).subscribe(
      (updatedCourse) => {
        console.log("Content uploaded and enrollment opened:", updatedCourse);
      },
      (error) => {
        console.error("Error uploading content and opening enrollment", error);
      }
    );
  }

  toggleEnrollment(course: Course): void {
    course.openForEnrollment = !course.openForEnrollment;

    this.courseService.updateCourse(course).subscribe(
      (updatedCourse) => {
        console.log("Course enrollment status updated:", updatedCourse);
      },
      (error) => {
        console.error("Error updating course enrollment status", error);
      }
    );
  }

  enableAssessment(course: Course): void {
    const endDate = new Date(course.endDate);
    const currentDate = new Date();
    if (currentDate > endDate) {
      console.log("Assessment enabled for course:", course.courseName);
    } else {
      console.log("Assessment can be enabled only after the course end date.");
    }
  }

  updateCourse() {
    if (this.selectedCourse) {
      this.courseService.updateCourse(this.selectedCourse).subscribe(
        (updatedCourse: Course) => {
          const index = this.courses.findIndex(
            (c) => c.id === updatedCourse.id
          );
          if (index !== -1) {
            this.courses[index] = updatedCourse;
            this.filteredCourses = [...this.courses];
            this.selectedCourse = null; // Close the edit form

            // Show success popup
            alert("Course updated successfully!"); // Popup message
          }
        },
        (error) => {
          console.error("Error updating course", error);
        }
      );
    }
  }

  cancelEdit() {
    this.selectedCourse = null;
  }

  navigateToCreateCourse() {
    this.router.navigate(["/create-course"]);
    this.router.navigate(["/manage-course"]);
    this.router.navigate(["/admin-dashboard"]);

  }
}
