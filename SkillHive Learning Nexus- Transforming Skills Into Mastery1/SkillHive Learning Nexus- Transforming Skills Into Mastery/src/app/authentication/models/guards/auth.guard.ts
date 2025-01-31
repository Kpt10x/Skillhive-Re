import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = sessionStorage.getItem('user');
  
  if (user) {
    // Check if the session is valid
    try {
      const userData = JSON.parse(user);
      if (userData && userData.email) {
        return true;
      }
    } catch (e) {
      console.error('Invalid user session:', e);
    }
  }

  // Clear any invalid session data
  sessionStorage.clear();
  return router.navigate(['/login']);
};