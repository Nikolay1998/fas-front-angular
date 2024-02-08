import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const user = inject(AuthenticationService).userValue;
  if (user) {
    return true;
  }
  inject(Router).navigate(['/login']);
  return false;
};
