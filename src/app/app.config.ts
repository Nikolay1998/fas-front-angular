import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { basicAuthInterceptor } from './_helpers/basic-auth.interceptor';
import { routes } from './app.routes';
import { errorInterceptor } from './_helpers/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([basicAuthInterceptor, errorInterceptor]),
    ),
  ]
};
