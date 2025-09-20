import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
// import { CourseService } from '../../services/Course.service';
import { CourseService } from '../../../course/services/course_service';
import { Course } from '../../../course/models/course_model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CanvasJSAngularChartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() courses: any[] = []; 
  chartOptions: any;
  chartData: {
    y: any; // Add fallback to 0
    label: string;
  }[] | undefined;
  constructor(private courseService: CourseService) { }

  
  // ngOnInit() {
  //   this.updateChart();
  // }
  ngOnInit() {
    this.initializeChart();
    this.courseService.fetchCourses().subscribe(courses => {
        this.courses = courses;
        this.chartData = courses.map(course => ({
            y: course.noOfEnrollments || 0, // Add fallback to 0
            label: course.courseName
        }));
        // Update chart
        console.log('Fetched courses:', courses); // Debug log

        //this.updateChart();
        setTimeout(() => {
          this.updateChart();
      }, 0);
    });
}


private initializeChart() {
  this.chartOptions = {
    animationEnabled: true,
    width: Math.max(window.innerWidth - 30, 600),
    height: 500,
    title: { text: "Course Enrollments: Expected vs Actual" },
    axisX: { title: "Courses", labelAngle: -15 },
    axisY: { title: "Number of Enrollments" },
    toolTip: { shared: true },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        e.dataSeries.visible = !e.dataSeries.visible;
        e.chart.render();
      }
    },
    data: [{ type: "column", dataPoints: [] }]  // Initialize with empty data
  };
}


  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.chartOptions) {
      this.chartOptions.width = Math.max(window.innerWidth - 30, 600);
      this.updateChart();
    }
  }


  updateChart() {

    if (!this.courses || this.courses.length === 0) {
      console.log('No courses available'); // Debug log
      return;
  }

  const dataPoints = this.courses.map(course => {
      const expectedEnrollments = Number(course.noOfEnrollments) || 0;
      const seatsLeft = Number(course.seatsLeft) || 0;
      
      console.log(`Course: ${course.courseName}`, { // Debug log
          expectedEnrollments,
          seatsLeft,
          
      });

      return {
          expected: expectedEnrollments,
          actual: expectedEnrollments - seatsLeft,
          // label: course.courseName 
          label: `${course.courseName}(${course.courseId})`

      };
  });


    this.chartOptions = {
      animationEnabled: true,
      //width: window.innerWidth - 30,  // Full width minus some padding
      width: Math.max(window.innerWidth - 30, 600),  // Minimum width of 600px
      height: 500,  // Set a fixed height
      title: { text: "Course Enrollments: Expected vs Actual" },
      axisX: { title: "Courses", labelAngle: -15 },
      axisY: { title: "Number of Enrollments" },
      toolTip: { shared: true },
      legend: {
        cursor: "pointer",
        itemclick: function (e: any) {
          e.dataSeries.visible = !e.dataSeries.visible;
          e.chart.render();
        }
      },
      data: [
        {
          type: "column",
          name: "Expected Enrollments",
          legendText: "Expected Enrollments",
          showInLegend: true,
          color: "blue",
          barWidth: 15,
          dataPoints: this.courses.map(course => ({
            label: course.courseName,
            //label: `${course.courseName}(${course.courseId})`,

            // Fix: Calculate total capacity (enrolled + seats left)
            y: (course.noOfEnrollments || 0) 
            //+ (course.seatsLeft || 0)
          }))
        },
        {
          type: "column",
          name: "Actual Enrollments",
          legendText: "Actual Enrollments",
          showInLegend: true,
          color: "green",
          barWidth: 15,
          dataPoints: this.courses.map(course => ({
            label: course.courseName,
            //label: `${course.courseName}(${course.courseId})`,
            y: course.noOfEnrollments - course.seatsLeft || 0  // Add fallback to 0
          }))
        }
      ]
    };
  }
}
