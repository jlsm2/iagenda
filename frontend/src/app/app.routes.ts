import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { CadastroComponent } from './features/auth/cadastro/cadastro.component';
import { RoutinePlannerComponent } from './routine-planner/routine-planner.component';
import { DailyRoutineComponent } from './features/salva-rotina/daily-routine/daily-routine.component';
import { RoutineHistoryComponent } from './features/routine-history/routine-history.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },
  {
    path: 'planner',
    component: RoutinePlannerComponent
  },
  {
    path: 'rotina',
    component: DailyRoutineComponent
  },
  {
    path: 'historico',
    component: RoutineHistoryComponent
  },
  {
    path: '',
    redirectTo: '/login', // agora redireciona para histórico como página inicial
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/historico'
  }
];
