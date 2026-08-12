import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'processos', pathMatch: 'full' },
  {
    path: 'processos',
    loadComponent: () =>
      import('./features/processos/processo-list/processo-list')
        .then(m => m.ProcessoList)
  },
  {
    path: 'processos/:id',
    loadComponent: () =>
      import('./features/processos/processo-detalhes/processo-detalhes')
        .then(m => m.ProcessoDetalhes)
  },
  { path: '**', redirectTo: 'processos' }
];
