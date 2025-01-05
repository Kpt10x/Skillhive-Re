import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { CandidateRegistrationComponent } from './candidates/components/candidate-registration/candidate-registration.component';
import { CandidateProfileComponent } from './candidates/components/candidate-profile/candidate-profile.component';
import { CandidateDashboardComponent } from './candidates/components/candidate-dashboard/candidate-dashboard.component';
import { EnrolledCoursesComponent } from './candidates/components/enrolled-courses/enrolled-courses.component';
import { UpcomingCoursesComponent } from './candidates/components/upcoming-courses/upcoming-courses.component';
import { CandidateLoginComponent } from './candidates/components/candidate-login/candidate-login.component';
import { ViewCandidatesComponent } from './candidates/components/view-candidates/view-candidates.component';

export const routes: Routes = [
  { path: 'register', component: CandidateRegistrationComponent },
  { path: 'login', component: CandidateLoginComponent },
  { path: 'profile/:id', component: CandidateProfileComponent },
  { path: 'dashboard/:id', component: CandidateDashboardComponent },
  { path: 'enrolled-courses/:id', component: EnrolledCoursesComponent },
  { path: 'upcoming-courses/:id', component: UpcomingCoursesComponent },
  { path: 'view-candidates', component: ViewCandidatesComponent }, // New route added here
  { path: '**', redirectTo: '/register' },
];

export const appRouterProviders = [
  provideRouter(routes),
  importProvidersFrom(CommonModule),
];
