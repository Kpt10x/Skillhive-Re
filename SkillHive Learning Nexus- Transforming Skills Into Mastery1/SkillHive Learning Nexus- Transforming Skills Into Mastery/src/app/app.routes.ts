import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CandidateRegistrationComponent } from './candidates/components/candidate-registration/candidate-registration.component';

export const routes: Routes = [
    { path: 'register', component: CandidateRegistrationComponent },
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: '**', redirectTo: '/register' },
   
  ];
  
export const appRouterProviders = [provideRouter(routes)];