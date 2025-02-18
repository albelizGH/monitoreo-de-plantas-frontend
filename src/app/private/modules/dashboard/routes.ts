import type { Routes } from '@angular/router';
import { AuthGuard } from '../../../core/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: async () => await import('./container/component').then((c) => c.PrivateDashboardContainer),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
