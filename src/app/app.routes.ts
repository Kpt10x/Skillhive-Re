import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { CandidateassessmentComponent } from './assessmentgrading/components/candidateassessment/candidateassessment.component';
import { AttemptAssessmentComponent } from './assessmentgrading/components/attemptassessment/attemptassessment.component';
import { McqTestComponent } from './assessmentgrading/components/mcqtest/mcqtest.component';
import { ScoresComponent } from './assessmentgrading/components/scores/scores.component';
import { ViewassessmentComponent } from './assessmentgrading/components/viewassessment/viewassessment.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'candidateassessment', component: CandidateassessmentComponent },
  { path: 'attemptassessment', component: AttemptAssessmentComponent },
  { path: 'mcqtest', component: McqTestComponent },
  { path: 'scores', component: ScoresComponent },
  { path: 'viewassessment', component: ViewassessmentComponent },
  { path: '**', redirectTo: 'candidateassessment' }
];

export const appRouterProviders = [
  provideRouter(routes),
  importProvidersFrom(CommonModule),
];
