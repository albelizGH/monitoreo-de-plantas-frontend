import { RenderMode, type ServerRoute } from '@angular/ssr';

export const SERVER_ROUTES: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
