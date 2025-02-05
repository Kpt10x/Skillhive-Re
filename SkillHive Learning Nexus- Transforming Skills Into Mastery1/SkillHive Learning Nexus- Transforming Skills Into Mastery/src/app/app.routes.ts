import { AdminveiwComponent } from './course/components/adminveiw/adminveiw.component';
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
import { DashboardComponent } from './instructor/components/dashboard/dashboard.component';
import { CreateInstructorComponent } from './instructor/components/create-instructor/create-instructor.component';
import { ViewInstructorComponent } from './instructor/components/view-instructor/view-instructor.component';
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
import { InstructorDashboardComponent } from './instructor/components/instructor-dashboard/instructor-dashboard.component';
import { ProfileUpdateComponent } from './instructor/components/profile-update/profile-update.component';
import { DeleteInstructorComponent } from './instructor/components/delete-instructor/delete-instructor.component';
//import { ViewCandidatesComponent } from './candidates/components/view-candidates/view-candidates.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  
  // Authentication routes
  { path: 'landing-page', component: LandingPageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent,children: [{path: 'chart',component: ChartComponent,}], canActivate: [RoleGuard], data: { role: 'admin' } },
  // { path: 'home', component: HomeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent , canActivate: [RoleGuard], data: { role: 'admin'}},
  { path: 'reset-password', component: ResetPasswordComponent ,canActivate: [RoleGuard], data: ['admin','instructor']},
  { path: '', redirectTo: '/forgot-password', pathMatch: 'full' },
  
  // Instructor Management routes
  // { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'instructor' }},
  { path: 'profile-update', component: ProfileUpdateComponent,canActivate: [RoleGuard], data: ['admin','instructor'] },
  { path: 'create-instructor', component: CreateInstructorComponent,canActivate: [RoleGuard], data: { role: 'admin' }  },
  {path:'delete-instructor',component:DeleteInstructorComponent ,canActivate: [RoleGuard], data: { role: 'admin' }},
  {path:'instructor-timetable',component:InstructorTimeTableComponent ,canActivate: [RoleGuard], data: { role: 'admin' }},
  {path:'add-course-content/:id',component:AddCourseContentComponent},

  // Instructor View routes
  { path: 'view-instructor', component: ViewInstructorComponent }, // Original view
  { path: 'instructor/view', children: [ // New organized views
  //{ path: 'availability', component: ViewByAvailabilityComponent },
  { path: 'course', component: ViewByCourseComponent },
  //{ path: 'details', component: ViewByDetailsComponent }
  ]},
  
  // Course Management routes
  //{ path: 'view-assigned-courses', component: ViewAssignedCoursesComponent },

  //candidates routes
  { path: 'register', component: CandidateRegistrationComponent ,canActivate: [RoleGuard], data: ['admin','instructor'] },
  { path: 'profile/:id', component: CandidateProfileComponent, canActivate: [RoleGuard], data:['admin','instructor'] },
  { path: 'dashboard/:id', component: CandidateDashboardComponent , canActivate: [RoleGuard], data: ['admin','instructor']},
  { path: 'enrolled-courses/:id', component: EnrolledCoursesComponent, canActivate: [RoleGuard], data:['admin','instructor'] },
  { path: 'upcoming-courses/:id', component: UpcomingCoursesComponent ,canActivate: [RoleGuard], data:['admin','instructor']},
  //{ path: 'view-candidates', component: ViewCandidatesComponent },
  

  //Course Module Routes
  { path: 'create-course', component: CreateCourseComponent},
  {path : 'manage-course', component: ManageCourseInstructorComponent},
  {path: 'admin-veiw',component: AdminveiwComponent},
  // Fallback route
  // { path: '**', redirectTo: 'login' },

  //assessment module routes
  { path: 'candidateassessment', component: CandidateassessmentComponent ,canActivate: [RoleGuard], data: ['admin','instructor'] },
  { path: 'attemptassessment', component: AttemptAssessmentComponent ,  canActivate: [RoleGuard], data: ['admin','instructor']},
  { path: 'mcqtest', component: McqTestComponent ,  canActivate: [RoleGuard], data: ['admin','instructor']},
  { path: 'scores', component: ScoresComponent , canActivate: [RoleGuard], data: ['admin','instructor']},
  { path: 'viewassessment', component: ViewassessmentComponent, canActivate: [RoleGuard], data: ['admin','instructor'] },
];

export const appRouterProviders = [
  provideRouter(routes),
  importProvidersFrom(CommonModule),
];
