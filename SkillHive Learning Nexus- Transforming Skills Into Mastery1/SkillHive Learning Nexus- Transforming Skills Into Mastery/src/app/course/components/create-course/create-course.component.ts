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
  categories: any[] = [];
  minAssignmentDate: string | null = null;
  existingCourses: any[] = [];

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

  // Helper function to check if course name matches instructor expertise
  doesCourseMatchExpertise(courseName: string, expertise: string): boolean {
    if (!courseName || !expertise) return false;
    
    const courseNameLower = courseName.toLowerCase();
    const expertiseLower = expertise.toLowerCase();

    console.log('Matching course:', courseNameLower, 'with expertise:', expertiseLower);

    // Simple direct match between course name and expertise
    const matches = courseNameLower.includes(expertiseLower) || 
                   expertiseLower.includes(courseNameLower);
    
    console.log('Match result:', matches);
    return matches;
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
        const overlaps = (newStartTime <= courseEndTime && newEndTime >= courseStartTime);
        console.log('Checking overlap for', instructor.name, 'Course dates:', course.startDate, '-', course.endDate, 'Overlaps:', overlaps);
        return overlaps;
      }
      return false;
    });
    
    return !hasOverlap;
  }

  filterInstructors(): void {
    const selectedCategory = this.createCourseForm.get('courseCategory')?.value;
    const startDate = this.createCourseForm.get('startDate')?.value;
    const endDate = this.createCourseForm.get('endDate')?.value;
    const courseName = this.createCourseForm.get('courseName')?.value;
    
    this.filteredInstructors = [...this.instructors];
    console.log('Initial instructors:', this.filteredInstructors);

    // Filter by course name matching expertise
    if (courseName) {
      this.filteredInstructors = this.filteredInstructors.filter(instructor => {
        const matches = this.doesCourseMatchExpertise(courseName, instructor.areaOfExpertise);
        console.log('Expertise filter:', instructor.name, instructor.areaOfExpertise, matches);
        return matches;
      });
    }

    // Filter by category if selected
    if (selectedCategory) {
      this.filteredInstructors = this.filteredInstructors.filter(instructor => {
        const matches = instructor.areaOfExpertise.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                       selectedCategory.toLowerCase().includes(instructor.areaOfExpertise.toLowerCase());
        console.log('Category filter:', instructor.name, matches);
        return matches;
      });
    }

    // Filter by availability if dates are selected
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      this.filteredInstructors = this.filteredInstructors.filter(instructor => {
        const isAvailable = this.isInstructorAvailable(instructor, startDateObj, endDateObj);
        console.log('Availability filter:', instructor.name, isAvailable);
        return isAvailable;
      });
    }

    console.log('Final filtered instructors:', this.filteredInstructors);
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
    this.filteredInstructors = [...this.instructors]; // Reset to all instructors
    this.minAssignmentDate = null; // Reset minimum assignment date
  }
}