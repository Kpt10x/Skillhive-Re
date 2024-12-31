import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core'; // Added for importing modules
import { CandidateRegistrationComponent } from './candidates/components/candidate-registration/candidate-registration.component';
import { CandidateProfileComponent } from './candidates/components/candidate-profile/candidate-profile.component';
import { DashboardComponent } from './candidates/components/dashboard/dashboard.component';
import { EnrolledCoursesComponent } from './candidates/components/enrolled-courses/enrolled-courses.component';
import { UpcomingCoursesComponent } from './candidates/components/upcoming-courses/upcoming-courses.component';

export const routes: Routes = [
  { path: 'register', component: CandidateRegistrationComponent },
  { path: 'profile/:id', component: CandidateProfileComponent },
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: 'enrolled-courses/:id', component: EnrolledCoursesComponent },
  { path: 'upcoming-courses/:id', component: UpcomingCoursesComponent },
  // { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: '**', redirectTo: '/register' },
];

export const appRouterProviders = [
  provideRouter(routes),
  importProvidersFrom(CommonModule), // Ensure CommonModule is added
];
