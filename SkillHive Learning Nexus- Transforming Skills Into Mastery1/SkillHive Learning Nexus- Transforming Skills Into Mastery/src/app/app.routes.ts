import { Routes } from '@angular/router';
import { DashboardComponent } from './instructor/components/dashboard/dashboard.component';
import { ViewAssignedCoursesComponent } from './instructor/components/view-assigned-courses/view-assigned-courses.component.spec';
import { CreateInstructorComponent } from './instructor/components/create-instructor/create-instructor.component';
import { ViewInstructorComponent } from './instructor/components/view-instructor/view-instructor.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { HomeComponent } from './authentication/components/home/home.component';
import { AdminDashboardComponent } from './authentication/components/admin-dashboard/admin-dashboard.component';

export const appRoutes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent}
  { path: 'dashboard', component: DashboardComponent },
  { path: 'view-assigned-courses', component: ViewAssignedCoursesComponent },
  { path: 'create-instructor', component: CreateInstructorComponent },
  { path:'view-instructor',component:ViewInstructorComponent}
  // { path: '**', redirectTo: 'login' }
  
];
