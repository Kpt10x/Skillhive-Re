import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminveiw',
  standalone: true,
  imports: [],
  templateUrl: './adminveiw.component.html',
  styleUrls: ['./adminveiw.component.css']
})
export class AdminveiwComponent implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  filterType: string = 'all'; // Default filter

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.http.get<any[]>('http://localhost:3000/courses').subscribe({
      next: (data) => {
        this.courses = data;
        this.applyFilter();
      },
      error: (err) => console.error('Error fetching courses:', err)
    });
  }

  applyFilter(): void {
    if (this.filterType === 'all') {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(course => course.status === this.filterType);
    }
  }

  setFilter(filter: string): void {
    this.filterType = filter;
    this.applyFilter();
  }
}
