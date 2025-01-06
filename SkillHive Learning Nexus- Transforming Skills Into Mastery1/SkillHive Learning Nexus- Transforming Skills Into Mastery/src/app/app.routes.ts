import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/components/login/login.component';
import { AdminDashboardComponent } from './authentication/components/admin-dashboard/admin-dashboard.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent },
  {path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: '**', redirectTo: 'login' }
];
