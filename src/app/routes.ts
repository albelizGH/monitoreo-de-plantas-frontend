import type { Routes } from '@angular/router';

export const ROOT_ROUTES: Routes = [
  {
    path: 'in',
    loadChildren: async () => await import('./private/routes').then((r) => r.PRIVATE_ROUTES),
  },
  {
    path: 'not-found',
    loadComponent: async () => await import('./public/pages/not-found/component').then((v) => v.PublicNotFoundPage),
  },
  {
    path: '',
    loadChildren: async () => await import('./public/routes').then((r) => r.PUBLIC_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
