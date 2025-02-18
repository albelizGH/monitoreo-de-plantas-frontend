import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { SERVER_CONFIGURATION } from './app/server-configuration';
import type { ApplicationRef } from '@angular/core';

const bootstrap = async (): Promise<ApplicationRef> => await bootstrapApplication(AppComponent, SERVER_CONFIGURATION);

export default bootstrap;
