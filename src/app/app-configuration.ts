import { provideExperimentalZonelessChangeDetection, type ApplicationConfig } from '@angular/core';
import {} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { ROOT_ROUTES } from './routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './core/interceptors/http.interceptor';



export const APP_CONFIGURATION: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(ROOT_ROUTES, withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(),withInterceptors([authInterceptorInterceptor])),
  ],
};
