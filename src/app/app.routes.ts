import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'processos', pathMatch: 'full' },
  {
    path: 'processos',
    loadComponent: () =>
      import('./features/processos/processo-list/processo-list')
        .then(m => m.ProcessoList)
  },
  { path: '**', redirectTo: 'processos' }
];
