import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateCourseComponent } from "./course/components/create-course.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CreateCourseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularProject';

}
