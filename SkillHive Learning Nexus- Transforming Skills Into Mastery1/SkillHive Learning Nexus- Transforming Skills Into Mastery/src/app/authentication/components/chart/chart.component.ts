import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

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
  
  ngOnInit() {
    this.updateChart();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateChart();  // Update chart on window resize
  }

  updateChart() {
    this.chartOptions = {
      animationEnabled: true,
      width: window.innerWidth - 30,  // Full width minus some padding
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
            y: course.noOfEnrollments + course.seatsLeft
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
            y: course.noOfEnrollments
          }))
        }
      ]
    };
  }
}
