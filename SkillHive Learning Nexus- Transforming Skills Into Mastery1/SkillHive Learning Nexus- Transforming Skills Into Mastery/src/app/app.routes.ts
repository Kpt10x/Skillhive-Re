import { Routes } from '@angular/router';
import { DashboardComponent } from './instructor/components/dashboard/dashboard.component';
import { ViewAssignedCoursesComponent } from './instructor/components/view-assigned-courses/view-assigned-courses.component.spec';
import { CreateInstructorComponent } from './instructor/components/create-instructor/create-instructor.component';
import { ViewInstructorComponent } from './instructor/components/view-instructor/view-instructor.component';


export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'view-assigned-courses', component: ViewAssignedCoursesComponent },
  { path: 'create-instructor', component: CreateInstructorComponent },
  {path:'view-instructor',component:ViewInstructorComponent}
  
];
