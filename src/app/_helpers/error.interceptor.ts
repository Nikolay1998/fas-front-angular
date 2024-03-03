import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);
  return next(req).pipe(catchError(err => {
    if ([401, 403].includes(err.status)) {
      authenticationService.logout();
    }
    const error = err.error.message || err.statusText;
    return throwError(() => error);
  })
  )
};
