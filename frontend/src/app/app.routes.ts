// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { CadastroComponent } from './features/auth/cadastro/cadastro.component';
import { TestDisplayComponent } from './features/test-display/test-display.component';
import { CampoAtividadesFlexiveisComponent } from './features/campo-atividades-flexiveis/campo-atividades-flexiveis.component';
import { DailyRoutineComponent } from './features/salva-rotina/daily-routine/daily-routine.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'test', component: TestDisplayComponent },
  { path: 'atividades', component: CampoAtividadesFlexiveisComponent},
  { path: 'rotina', component: DailyRoutineComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
