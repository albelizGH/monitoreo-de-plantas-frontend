import type { ApplicationConfig } from '@angular/core';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
// import { provideServerRoutesConfig } from '@angular/ssr';
import { provideServerRouting } from '@angular/ssr';
import { APP_CONFIGURATION } from './app-configuration';
import { SERVER_ROUTES } from './routes.server';

const configuration: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(SERVER_ROUTES),
  ],
};

export const SERVER_CONFIGURATION = mergeApplicationConfig(APP_CONFIGURATION, configuration);
