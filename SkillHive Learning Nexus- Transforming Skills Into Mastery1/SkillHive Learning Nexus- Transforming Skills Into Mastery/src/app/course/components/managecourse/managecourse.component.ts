import { Component, OnInit, ElementRef, QueryList, Renderer2, ViewChildren, AfterViewInit } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Course } from "../../models/course_model";
import { CourseService } from "../../services/course_service";
@Component({
  selector: "manage-course",
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  providers: [HttpClient],
  templateUrl: "./managecourse.component.html",
  styleUrls: ["./managecourse.component.css"],
})
export class ManageCourseInstructorComponent implements OnInit, AfterViewInit {
  selectedStatus: string = ""; // To hold the selected status
  courses: any[] = []; // Initialize courses as an empty array
  filteredCourses: any[] = []; // Add this property
  candidates: any[] = []; // Store candidates to calculate enrollments
  enrollments: any[] = []; // Store enrollment data

  @ViewChildren('dropdownBtn') dropdownBtns!: QueryList<ElementRef>;
  @ViewChildren('dropdownContainer') dropdownContainers!: QueryList<ElementRef>;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    this.fetchCourses(); // Fetch courses on component initialization
    this.fetchCandidates(); // Fetch candidates on component initialization
    this.fetchEnrollments(); // Fetch enrollments on component initialization
    this.updateSeatsLeft();
  }
  updateSeatsLeft(): void {
    this.http.get<any[]>("http://localhost:3000/courses-enrolled-by-candidates")
      .subscribe((candidates: any[]) => {
        // Reset seatsLeft for all courses before updating
        this.courses.forEach(course => {
          course.seatsLeft = 30; // Reset to default before updating
        });

        // Update seats left based on enrolled candidates
        candidates.forEach((candidate: any) => {
          // Match course by courseName and instructorName
          const course = this.courses.find(c => 
            c.courseName === candidate.courseName && 
            c.instructorName === candidate.instructorName
          );

          if (course && course.seatsLeft > 0) {
            course.seatsLeft -= 1; // Reduce available seats per enrolled student
          }
        });

        this.filteredCourses = [...this.courses]; // Refresh UI
      },
      (error) => {
        console.error("Error fetching enrolled candidates:", error);
      });
    }
    
  // Fetch courses from API
  fetchCourses() {
    this.http.get<any[]>("http://localhost:3000/courses").subscribe((data) => {
      this.courses = data; // Update courses with fetched data
      this.filteredCourses = data; // Initialize filtered courses
      this.updateSeatsLeft(); // Update remaining seats for each course
    });
  }

  // Fetch candidate enrollment data
  fetchCandidates() {
    this.http.get<any[]>("http://localhost:3000/candidates").subscribe((data) => {
      this.candidates = data; // Store candidates data
    });
  }

  // Fetch enrollment data
  fetchEnrollments() {
    this.http.get<any[]>("http://localhost:3000/courses-enrolled-by-candidates").subscribe((data) => {
      this.enrollments = data; // Store enrollment data
      this.updateSeatsLeft(); // Update remaining seats after fetching enrollments
    });
  }

  // Filter courses by status
  filterCourses(status: string) {
    if (!this.courses || this.courses.length === 0) {
      console.error("No courses available to filter");
      return;
    }

    if (!status) {
      this.filteredCourses = [...this.courses]; // Spread to trigger change detection
    } else {
      this.filteredCourses = this.courses.filter((course) => {
        const courseStatus = this.getCourseStatus(course);
        console.log("Filtering:", courseStatus, "Expected:", status); // Debugging
        return courseStatus === status;
      });
    }
  }

  // Get course status based on start and end date
  getCourseStatus(course: any): string {
    const currentDate = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (startDate > currentDate) {
      return 'Upcoming'; // Course has not started yet
    } else if (startDate <= currentDate && endDate >= currentDate) {
      return 'Ongoing'; // Course is currently ongoing
    } else {
      return 'Completed'; // Course has ended
    }
  }

  
  ngAfterViewInit(): void {
    this.dropdownBtns.forEach((btn, index) => {
      btn.nativeElement.addEventListener('click', (event: Event) => {
        event.preventDefault(); // Prevent default anchor behavior
        this.toggleDropdown(index); // Pass correct index
      });
    });
  }

  toggleDropdown(index: number): void {
    this.dropdownContainers.forEach((container, i) => {
      if (i === index) {
        const isVisible = container.nativeElement.style.display === 'block';
        this.renderer.setStyle(container.nativeElement, 'display', isVisible ? 'none' : 'block');
      } else {
        this.renderer.setStyle(container.nativeElement, 'display', 'none'); // Close other dropdowns
      }
    });
  }

  // Method to enroll a candidate in a course
  enrollCandidate(courseId: string) {
    const enrollmentData = {
      courseId: courseId,
      candidateId: "someCandidateId", // Replace with logic to select the candidate
    };
  
    this.http.post("http://localhost:3000/courses-enrolled-by-candidates", enrollmentData).subscribe(
      (response) => {
        console.log("Candidate enrolled successfully:", response);
        this.fetchEnrollments(); // Refresh enrollments after successful enrollment
      },
      (error) => {
        console.error("Error enrolling candidate:", error);
      }
    );
  }
}  
