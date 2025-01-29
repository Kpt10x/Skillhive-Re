import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css'],
  standalone: true,
  imports: [FullCalendarModule, HttpClientModule, CommonModule, RouterModule],
})
export class InstructorDashboardComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    events: [], // To be populated dynamically
    dateClick: this.handleDateClick.bind(this), // Bind date click handler
  };

  currentInstructor: string = ''; // To store the logged-in instructor's name
  private allCourses: any[] = []; // Store all courses fetched from API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setCurrentInstructor();
    this.fetchCourses();
  }

  /**
   * Set the current instructor's name dynamically from a service or local storage.
   */
  setCurrentInstructor(): void {
    // Fetch the instructor name from local storage or a service
    const loggedInInstructor = JSON.parse(sessionStorage.getItem('loggedInInstructor') || '{}');
    this.currentInstructor = loggedInInstructor.name || 'Instructor'; // Default to 'Instructor' if name is not available
  }

  /**
   * Fetch all courses from the backend and filter them for the current instructor.
   */
  fetchCourses(): void {
    const apiUrl = 'http://localhost:3000/courses'; // API endpoint
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        console.log('All courses:', data); 
        this.allCourses = data.filter(
          (course) => course.instructor.toLowerCase() === this.currentInstructor.toLowerCase()
        );
        console.log('Filtered courses:', this.allCourses); // Log filtered courses

        // Populate calendar events based on the instructor's courses
        const events = this.allCourses.map((course) => ({
          title: course.courseName,
          start: course.startDate,
          end: course.endDate,
          extendedProps: {
            courseCategory: course.courseCategory,
          },
        }));

        this.calendarOptions = { ...this.calendarOptions, events };
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  /**
   * Handle clicks on specific dates and display the courses assigned to the instructor on that date.
   */
  handleDateClick(info: any): void {
    const clickedDate = new Date(info.dateStr);

    // Filter courses based on whether the clicked date is within their start and end dates
    const ongoingCourses = this.allCourses.filter((course) => {
      const courseStartDate = new Date(course.startDate);
      const courseEndDate = new Date(course.endDate);
      return clickedDate >= courseStartDate && clickedDate <= courseEndDate;
    });

    if (ongoingCourses.length > 0) {
      const courseDetails = ongoingCourses
        .map((course) => `Course: ${course.courseName} (${course.courseCategory})`)
        .join('\n');
      alert(`Courses on ${info.dateStr}:\n\n${courseDetails}`);
    } else {
      alert(`No courses assigned on ${info.dateStr}`);
    }
  }
}
