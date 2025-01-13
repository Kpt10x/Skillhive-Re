import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

// Instructor imports
import { DashboardComponent } from './instructor/components/dashboard/dashboard.component';
//import { ViewAssignedCoursesComponent } from './instructor/components/view-assigned-courses/view-assigned-courses.component';
import { CreateInstructorComponent } from './instructor/components/create-instructor/create-instructor.component';
import { ViewInstructorComponent } from './instructor/components/view-instructor/view-instructor.component';
//import { ViewByAvailabilityComponent } from './instructor/components/view-by-availability/view-by-availability.component';
import { ViewByCourseComponent } from './instructor/components/view-by-course/view-by-course.component';
//import { ViewByDetailsComponent } from './instructor/components/view-by-details/view-by-details.component';

// Authentication imports
import { LoginComponent } from './authentication/components/login/login.component';
//import { HomeComponent } from './authentication/components/home/home.component';
import { AdminDashboardComponent } from './authentication/components/admin-dashboard/admin-dashboard.component';
import { CreateCourseComponent } from './course/components/create-course/create-course.component';

export const routes: Routes = [
  { path: '', redirectTo: 'create-instructor', pathMatch: 'full' },
  
  // Authentication routes
  { path: 'login', component: LoginComponent },
  //{ path: 'home', component: HomeComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  
  // Instructor Management routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-instructor', component: CreateInstructorComponent },
  
  // Instructor View routes
  { path: 'view-instructor', component: ViewInstructorComponent }, // Original view
  { path: 'instructor/view', children: [ // New organized views
    //{ path: 'availability', component: ViewByAvailabilityComponent },
//{ path: 'course', component: ViewByCourseComponent },
    //{ path: 'details', component: ViewByDetailsComponent }
  ]},
  
  // Course Management routes
  //{ path: 'view-assigned-courses', component: ViewAssignedCoursesComponent },
  

  //course module 
  { path: 'create-course', component: CreateCourseComponent},
  // Fallback route
  { path: '**', redirectTo: 'login' }
];

export const appRouterProviders = [
  provideRouter(routes),
  importProvidersFrom(CommonModule),
];
