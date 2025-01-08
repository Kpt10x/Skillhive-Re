import { Component, OnInit } from '@angular/core';
import { Course } from '../../Models/course.model';
import { InstructorService } from '../../Services/instructor.service';

@Component({
  selector: 'app-view-assigned-courses',
  templateUrl: './view-assigned-courses.component.html',
  styleUrls: ['./view-assigned-courses.component.css']
})
export class ViewAssignedCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private instructorService: InstructorService) {}

  ngOnInit() {
    this.instructorService.getAssignedCourses().subscribe(data => {
      this.courses = data;
    });
  }
}
