import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

// Instructor imports
import { DashboardComponent } from './instructor/components/dashboard/dashboard.component';
import { ViewAssignedCoursesComponent } from './instructor/components/view-assigned-courses/view-assigned-courses.component.spec';
import { CreateInstructorComponent } from './instructor/components/create-instructor/create-instructor.component';
import { ViewInstructorComponent } from './instructor/components/view-instructor/view-instructor.component';

// Authentication imports
import { LoginComponent } from './authentication/components/login/login.component';
import { HomeComponent } from './authentication/components/home/home.component';
import { AdminDashboardComponent } from './authentication/components/admin-dashboard/admin-dashboard.component';

// Candidate imports
import { CandidateRegistrationComponent } from './candidates/components/candidate-registration/candidate-registration.component';
import { CandidateProfileComponent } from './candidates/components/candidate-profile/candidate-profile.component';
import { CandidateDashboardComponent } from './candidates/components/candidate-dashboard/candidate-dashboard.component';
import { EnrolledCoursesComponent } from './candidates/components/enrolled-courses/enrolled-courses.component';
import { UpcomingCoursesComponent } from './candidates/components/upcoming-courses/upcoming-courses.component';
import { CandidateLoginComponent } from './candidates/components/candidate-login/candidate-login.component';
import { ViewCandidatesComponent } from './candidates/components/view-candidates/view-candidates.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  
  // Instructor routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'view-assigned-courses', component: ViewAssignedCoursesComponent },
  { path: 'create-instructor', component: CreateInstructorComponent },
  { path: 'view-instructor', component: ViewInstructorComponent },
  
  // Candidate routes
  { path: 'candidate/register', component: CandidateRegistrationComponent },
  { path: 'candidate/login', component: CandidateLoginComponent },
  { path: 'candidate/profile/:id', component: CandidateProfileComponent },
  { path: 'candidate/dashboard/:id', component: CandidateDashboardComponent },
  { path: 'candidate/enrolled-courses/:id', component: EnrolledCoursesComponent },
  { path: 'candidate/upcoming-courses', component: UpcomingCoursesComponent },
  { path: 'candidate/view', component: ViewCandidatesComponent },
  
  { path: '**', redirectTo: 'login' }
];

export const appRouterProviders = [
  provideRouter(routes),
  importProvidersFrom(CommonModule),
];
