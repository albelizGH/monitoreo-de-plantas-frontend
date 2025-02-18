import type { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: async () => await import('./container/component').then((c) => c.PrivateContainer),
    children: [
      {
        path: '',
        loadChildren: async () => await import('./modules/dashboard/routes').then((r) => r.DASHBOARD_ROUTES),
      },
      {
        path: '**',
        redirectTo: 'not-found',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
