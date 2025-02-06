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
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: "create-course",
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: "./create-course.component.html",
  styleUrls: ["./create-course.component.css"],
})
export class CreateCourseComponent implements OnInit {
  createCourseForm: FormGroup;
  instructors: any[] = [];
  filteredInstructors: any[] = [];
  categories: any[] = [];
  minAssignmentDate: string | null = null;
  existingCourses: any[] = [];
  isCoursesDropdownVisible = false;
  isInstructorsDropdownVisible = false;
  isCandidateDropdownVisible: boolean = false;

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
    private http: HttpClient,
    public authService: AuthService
  ) {
    this.createCourseForm = this.fb.group({
      courseName: ["", [Validators.required, Validators.minLength(3)]],
      courseCategory: ["", Validators.required],
      courseDurationMonths: ["", [Validators.required, Validators.min(1), Validators.max(24)]],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      instructor: ["", Validators.required],
      assessmentDate: ["", Validators.required],
    });

    // Subscribe to date changes
    this.createCourseForm.get('startDate')?.valueChanges.subscribe(() => {
      this.filterInstructors();
    });

    this.createCourseForm.get('endDate')?.valueChanges.subscribe(() => {
      this.filterInstructors();
    });

    // Subscribe to course name changes
    this.createCourseForm.get('courseName')?.valueChanges.subscribe(() => {
      this.filterInstructors();
    });
  }

  ngOnInit(): void {
    // Fetch both instructors and courses
    forkJoin({
      profiles: this.http.get<any[]>('http://localhost:3000/profiles'),
      courses: this.http.get<any[]>('http://localhost:3000/courses')
    }).subscribe({
      next: (data) => {
        // Store courses for availability checking
        this.existingCourses = data.courses;

        // Filter profiles to get only instructors
        this.instructors = data.profiles
          .filter(profile => profile.role === 'instructor')
          .map(instructor => ({
            id: instructor.id,
            name: instructor.name,
            areaOfExpertise: instructor.areaOfExpertise,
            experience: instructor.experience
          }));

        this.filterInstructors();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });

    this.categories = this.hardcodedCategories;

    // Set minimum assessment date
    const today = new Date();
    this.minAssignmentDate = today.toISOString().split('T')[0];
  }

  isInstructorAvailable(instructor: any, startDate: Date, endDate: Date): boolean {
    if (!this.existingCourses) return true;

    // Convert dates to timestamps for comparison
    const newStartTime = startDate.getTime();
    const newEndTime = endDate.getTime();

    // Check if instructor has any overlapping courses
    const hasOverlap = this.existingCourses.some(course => {
      if (course.instructor === instructor.name) {
        const courseStartTime = new Date(course.startDate).getTime();
        const courseEndTime = new Date(course.endDate).getTime();

        // Check for date overlap
        return (newStartTime <= courseEndTime && newEndTime >= courseStartTime);
      }
      return false;
    });

    return !hasOverlap;
  }

  filterInstructors(): void {
    //const selectedCategory = this.createCourseForm.get('courseCategory')?.value;
    const startDate = this.createCourseForm.get('startDate')?.value;
    const endDate = this.createCourseForm.get('endDate')?.value;
    const courseName = this.createCourseForm.get('courseName')?.value;

    this.filteredInstructors = [...this.instructors];

    //console.log('Selected Category:', selectedCategory);
    console.log('Initial Instructors:', this.filteredInstructors);

    // Filter by course name matching expertise
    if (courseName) {
        this.filteredInstructors = this.filteredInstructors.filter(instructor => {
            return this.doesCourseMatchExpertise(courseName, instructor.areaOfExpertise);
        });
        console.log('Instructors after course name filter:', this.filteredInstructors);
    }

    // Filter by category if selected
    /*if (selectedCategory) {
        this.filteredInstructors = this.filteredInstructors.filter(instructor => {
            const matches = instructor.areaOfExpertise.toLowerCase().includes(selectedCategory.toLowerCase());
            console.log(`Instructor: ${instructor.name}, Expertise: ${instructor.areaOfExpertise}, Matches: ${matches}`);
            return matches;
        });
        console.log('Instructors after category filter:', this.filteredInstructors);
    }*/

    // Filter by availability if dates are selected
    if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        this.filteredInstructors = this.filteredInstructors.filter(instructor => {
            return this.isInstructorAvailable(instructor, startDateObj, endDateObj);
        });
        console.log('Instructors after availability filter:', this.filteredInstructors);
    }

    console.log('Final filtered instructors:', this.filteredInstructors);
}
  doesCourseMatchExpertise(courseName: string, expertise: string): boolean {
    if (!courseName || !expertise) return false;

    const courseNameLower = courseName.toLowerCase();
    const expertiseLower = expertise.toLowerCase();

    return courseNameLower.includes(expertiseLower) || expertiseLower.includes(courseNameLower);
  }

  onEndDateChange(): void {
    const endDate = this.createCourseForm.get("endDate")?.value;
    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1); // Set to one day after the end date
      this.createCourseForm.patchValue({
        assessmentDate: endDateObj.toISOString().split("T")[0], // Format to YYYY-MM-DD
      });
      this.minAssignmentDate = endDateObj.toISOString().split("T")[0]; // Update minAssignmentDate
    } else {
      this.minAssignmentDate = null; // Reset if no end date is selected
    }
  }

  onSubmit() {
    if (this.createCourseForm.valid) {
      //const courseData = this.createCourseForm.value;
      const courseData = {
        ...this.createCourseForm.value,
        openForEnrollment: false,
        content: "",
        enableAssessment: false,
        noOfEnrollments: 30,
        seatsLeft: 30
      };
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
    this.filteredInstructors = [...this.instructors]; // Reset to all instructors
    this.minAssignmentDate = null; // Reset minimum assignment date
  }
  
}

