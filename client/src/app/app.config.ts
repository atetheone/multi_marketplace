import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { tenantInterceptor } from '#core/interceptors/tenant.interceptor';
import { authInterceptor } from '#core/interceptors/auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      authInterceptor,
      tenantInterceptor
    ])),
    provideNativeDateAdapter(), // Add this line for MatDatepicker
  ]
};
