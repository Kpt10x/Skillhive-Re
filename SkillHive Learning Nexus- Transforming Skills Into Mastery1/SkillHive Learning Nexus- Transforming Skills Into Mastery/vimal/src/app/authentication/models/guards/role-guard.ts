import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const expectedRole = route.data['role'];

    if (user && user.role === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/']); 
      return false;
    }
  }
}
