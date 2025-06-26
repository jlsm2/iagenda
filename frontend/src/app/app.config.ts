import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; // Importar provideRouter
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes'; // Importar suas rotas

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // <-- Fornece as rotas para a aplicação
    provideHttpClient(withFetch())
  ]
};