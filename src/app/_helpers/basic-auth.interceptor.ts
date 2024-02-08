import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';


export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const user = inject(AuthenticationService).userValue;
  const isLoggedIn = user?.authdata;
  console.debug("sdfsdf");
  if (isLoggedIn) {
    req = req.clone({
      setHeaders: {
        Authorization: `Basic ${user.authdata}`
      }
    });
  }
  return next(req);
};