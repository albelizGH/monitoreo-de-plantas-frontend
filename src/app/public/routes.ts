import type { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: async () => await import('./container/component').then((c) => c.PublicContainer),
    children: [
      {
        path: '',
        loadComponent: async () => await import('./pages/login/component').then((v) => v.PublicLoginPage),
      },
      {
        path: 'register',
        loadComponent: async () => await import('./pages/register/component').then((v) => v.PublicRegisterPage),
      }
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
