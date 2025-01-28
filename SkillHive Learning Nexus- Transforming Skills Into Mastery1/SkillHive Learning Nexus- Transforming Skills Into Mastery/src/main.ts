

// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appRouterProviders} from './app/app.routes'
// import { provideHttpClient, withFetch } from '@angular/common/http';

// bootstrapApplication(AppComponent, {
//   providers: [appRouterProviders, provideHttpClient(withFetch())],
// }).catch((err) => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
