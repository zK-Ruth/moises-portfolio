import { Routes } from '@angular/router';
import { LayoutSiteComponent } from './shared/layouts/layout-site.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutSiteComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];
