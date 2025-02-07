import { AdminViewComponent } from './course/components/adminveiw/adminveiw.component';
import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

// assessment imports
import { CandidateassessmentComponent } from './assessmentgrading/components/candidateassessment/candidateassessment.component';
import { AttemptAssessmentComponent } from './assessmentgrading/components/attemptassessment/attemptassessment.component';
import { McqTestComponent } from './assessmentgrading/components/mcqtest/mcqtest.component';
import { ScoresComponent } from './assessmentgrading/components/scores/scores.component';
import { ViewassessmentComponent } from './assessmentgrading/components/viewassessment/viewassessment.component';

// instructor imports
// import { DashboardComponent } from './instructor/components/dashboard/dashboard.component';
import { CreateInstructorComponent } from './instructor/components/create-instructor/create-instructor.component';
// import { ViewInstructorComponent } from './instructor/components/view-instructor/view-instructor.component';
import { ViewByCourseComponent } from './instructor/components/view-by-course/view-by-course.component';
import {AddCourseContentComponent} from './instructor/components/add-course-content/add-course-content.component';
import { InstructorTimeTableComponent } from '../app/instructor/components/instructor-timetable/instructor-timetable.component';
//import { ViewByDetailsComponent } from './instructor/components/view-by-details/view-by-details.component';
//import { ViewAssignedCoursesComponent } from './instructor/components/view-assigned-courses/view-assigned-courses.component';
//import { ViewByAvailabilityComponent } from './instructor/components/view-by-availability/view-by-availability.component';


import { CreateCourseComponent } from './course/components/create-course/create-course.component';
import { ManageCourseInstructorComponent } from './course/components/managecourse/managecourse.component';

// Authentication imports
import { LandingPageComponent } from './authentication/components/landing-page/landing-page.component';
import { ProfileComponent } from '../app/authentication/components/profile/profile.compoenent';
import { LoginComponent } from './authentication/components/login/login.component';
import { ForgotPasswordComponent } from './authentication/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/components/reset-password/reset-password.component';
import { RoleGuard } from '../app/authentication/models/guards/role-guard';
import { ChartComponent } from './authentication/components/chart/chart.component';
import { AdminDashboardComponent } from './authentication/components/admin-dashboard/admin-dashboard.component';
//import { HomeComponent } from './authentication/components/home/home.component';

//candidate imports
import { CandidateRegistrationComponent } from './candidates/components/candidate-registration/candidate-registration.component';
import { CandidateProfileComponent } from './candidates/components/candidate-profile/candidate-profile.component';
import { CandidateDashboardComponent } from './candidates/components/candidate-dashboard/candidate-dashboard.component';
import { EnrolledCoursesComponent } from './candidates/components/enrolled-courses/enrolled-courses.component';
import { UpcomingCoursesComponent } from './candidates/components/upcoming-courses/upcoming-courses.component';
import { ProfileUpdateComponent } from './instructor/components/profile-update/profile-update.component';
import { ViewAllInstructorsComponent } from './instructor/components/view-all-instructors/view-all-instructors.component';
import { DeleteInstructorComponent } from './instructor/components/delete-instructor/delete-instructor.component';
import { InstructorDashboardComponent } from './instructor/components/instructor-dashboard/instructor-dashboard.component';
import { ViewCandidatesComponent } from './candidates/components/view-candidates/view-candidates.component';
import { ResultsComponent } from './assessmentgrading/components/results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  
  // Authentication routes
  { path: 'landing-page', component: LandingPageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent,children: [{path: 'chart',component: ChartComponent,}], canActivate: [RoleGuard], data: { role: 'admin' } },
  // { path: 'home', component: HomeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent , canActivate: [RoleGuard], data: { role: ['admin', 'instructor'] }},
  { path: 'reset-password', component: ResetPasswordComponent ,canActivate: [RoleGuard], data: { role: { role: ['admin', 'instructor'] } }},
  // { path: '', redirectTo: '/forgot-password', pathMatch: 'full' },
  { path: 'admin-profile', component: ProfileComponent },

  
  // Instructor Management routes
  { path: 'instructor-dashboard', component: InstructorDashboardComponent, canActivate: [RoleGuard], data: { role: 'instructor' }},
  { path: 'profile-update', component: ProfileUpdateComponent,canActivate: [RoleGuard], data: { role: ['admin', 'instructor'] }  },
  { path: 'create-instructor', component: CreateInstructorComponent,canActivate: [RoleGuard], data: { role: 'admin' }  },
  {path:'delete-instructor',component:DeleteInstructorComponent ,canActivate: [RoleGuard], data: { role: 'admin' }},
  {path:'instructor-timetable',component:InstructorTimeTableComponent ,canActivate: [RoleGuard], data: { role: 'instructor' }},
  {path:'add-course-content/:id',component:AddCourseContentComponent},

  // Instructor View routes
  { path: 'view-all-instructors', component: ViewAllInstructorsComponent }, // Original view
  { path: 'instructor/view', children: [ // New organized views
  //{ path: 'availability', component: ViewByAvailabilityComponent },
  { path: 'course', component: ViewByCourseComponent },
  // { path: 'details', component: ViewByDetailsComponent }
  ]},
  
  // Course Management routes
  //{ path: 'view-assigned-courses', component: ViewAssignedCoursesComponent },

  //candidates routes
  { path: 'register', component: CandidateRegistrationComponent },
  { path: 'profile/:id', component: CandidateProfileComponent, canActivate: [RoleGuard], data:{ role: ['admin', 'instructor','candidate'] } },
  // { path: 'dashboard/:id', component: CandidateDashboardComponent , canActivate: [RoleGuard], data: { role: ['candidate'] }},
  { path: 'enrolled-courses/:id', component: EnrolledCoursesComponent, canActivate: [RoleGuard], data: { role: ['candidate'] } },
  { path: 'upcoming-courses/:id', component: UpcomingCoursesComponent ,canActivate: [RoleGuard], data:{ role: ['candidate'] }},
  { path: 'view-candidates', component: ViewCandidatesComponent ,canActivate: [RoleGuard], data:{ role: ['instructor'] }},
{ path: 'dashboard/:id', component: EnrolledCoursesComponent },


  //Course Module Routes
  { path: 'create-course', component: CreateCourseComponent, canActivate: [RoleGuard], data: { role: 'admin' }},
  {path : 'manage-course', component: ManageCourseInstructorComponent, canActivate: [RoleGuard], data: { role: ['admin', 'instructor'] }},
  {path: 'admin-view',component: AdminViewComponent, canActivate: [RoleGuard], data: { role: 'admin' }},
  // Fallback route
  // { path: '**', redirectTo: 'login' },

  //assessment module routes
  { path: 'candidateassessment/:id', component: CandidateassessmentComponent ,canActivate: [RoleGuard], data:{ role: ['candidate'] }},
  { path: 'candidateassessment/:candidateId/attemptassessment/:courseId', component: AttemptAssessmentComponent },
  { path: 'mcqtest/:candidateId/:testId', component: McqTestComponent ,canActivate: [RoleGuard], data:{ role: ['candidate'] }},
  { path: 'scores/:candidateId', component: ScoresComponent ,canActivate: [RoleGuard], data:{ role: ['candidate'] }},
  { path: 'viewassessments', component: ViewassessmentComponent ,canActivate: [RoleGuard], data:{ role: ['instructor'] }},
  { path:'results/:candidateId',component: ResultsComponent, canActivate: [RoleGuard], data:{ role: ['candidate']}}
];

export const appRouterProviders = [
  provideRouter(routes),
  importProvidersFrom(CommonModule),
];
