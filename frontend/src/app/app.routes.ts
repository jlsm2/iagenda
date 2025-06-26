import { Routes } from '@angular/router';

// Supondo que estes são os caminhos corretos para seus componentes
import { LoginComponent } from './features/auth/login/login.component';
import { CadastroComponent } from './features/auth/cadastro/cadastro.component';
import { RoutinePlannerComponent } from './routine-planner/routine-planner.component';
import { DailyRoutineComponent } from './features/salva-rotina/daily-routine/daily-routine.component'; // <-- A ROTA QUE FALTAVA

export const routes: Routes = [
  // --- Rotas de Autenticação ---
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },

  // --- Rotas Principais da Aplicação ---
  {
    path: 'planner', // A página onde o usuário MONTA a rotina
    component: RoutinePlannerComponent
  },
  {
    path: 'rotina', // <-- ROTA CORRIGIDA! A página que MOSTRA a rotina gerada/salva
    component: DailyRoutineComponent
  },

  // --- Rotas de Redirecionamento Padrão ---
  {
    path: '', // Se o usuário acessar a raiz do site...
    redirectTo: '/login', // ...ele é redirecionado para o login.
    pathMatch: 'full'
  },
  {
    path: '**', // Rota "curinga": se o usuário digitar qualquer URL que não existe...
    redirectTo: '/login' // ...ele também é levado para o login.
  },
];
