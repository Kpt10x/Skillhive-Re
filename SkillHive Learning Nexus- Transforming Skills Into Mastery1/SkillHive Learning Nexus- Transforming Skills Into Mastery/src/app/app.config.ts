import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { CandidateRegistrationComponent } from './candidates/components/candidate-registration/candidate-registration.component';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideClientHydration(),
    provideRouter([
      { path: '', component: AppComponent },
      { path: 'register', component: CandidateRegistrationComponent},
     
    ]),
  ],
};
