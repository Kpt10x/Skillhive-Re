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
    this.http.get<Course[]>("http://localhost:3000/courses").subscribe(
      (courses) => {
        // Check and update enableAssessment based on assessment date
        const currentDate = new Date();
        const coursesToUpdate: { id: string, enableAssessment: boolean }[] = [];

        this.courses = courses.map((course) => {
          const assessmentDate = new Date(course.assessmentDate);
          const shouldEnableAssessment = currentDate >= assessmentDate;

          // If assessment should be enabled but isn't, add to update list
          if (shouldEnableAssessment && !course.enableAssessment) {
            coursesToUpdate.push({ id: course.id, enableAssessment: true });
          }

          return {
            ...course,
            status: this.updateCourseStatus(course),
            enableAssessment: shouldEnableAssessment || course.enableAssessment
          };
        });

        // Update courses in db.json if needed
        if (coursesToUpdate.length > 0) {
          console.log('Courses to enable assessment:', coursesToUpdate);
          coursesToUpdate.forEach(update => {
            this.http.patch(`http://localhost:3000/courses/${update.id}`, { enableAssessment: true })
              .subscribe(
                () => console.log(`Assessment enabled for course ${update.id}`),
                error => console.error(`Error enabling assessment for course ${update.id}:`, error)
              );
          });
        }

        this.updateSeatsLeft();
        this.extractUniqueStatuses();
        this.filteredCourses = [...this.courses];
      },
      (error) => {
        console.error("Error fetching courses:", error);
      }
    );
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
        (enrollments: any[]) => {
          console.log("Fetched enrolled candidates:", enrollments);

          // Group enrollments by courseId
          const enrollmentCounts = enrollments.reduce((acc, enrollment) => {
            acc[enrollment.courseId] = (acc[enrollment.courseId] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });

          // Update seatsLeft for each course based on enrollments
          this.courses = this.courses.map((course) => {
            const enrolledCount = enrollmentCounts[course.courseId] || 0;
            return {
              ...course,
              seatsLeft: course.noOfEnrollments - enrolledCount,
            };
          });

          console.log("Updated courses with seatsLeft:", this.courses);
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
