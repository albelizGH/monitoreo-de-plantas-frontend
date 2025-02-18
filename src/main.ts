import { bootstrapApplication } from '@angular/platform-browser';
import { APP_CONFIGURATION } from './app/app-configuration';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, APP_CONFIGURATION).catch(() => {
  throw new Error();
});
