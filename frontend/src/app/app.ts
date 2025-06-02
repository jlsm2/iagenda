// ARQUIVO: src/app/app.component.ts
// (Se o seu arquivo principal do componente raiz se chama app.ts, coloque este conteúdo nele ou renomeie)
// DESCRIÇÃO: Componente raiz da aplicação Angular.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Se você não usou --routing=false na criação do projeto e tem rotas,
// você pode precisar do RouterOutlet aqui.
// import { RouterOutlet } from '@angular/router';

// Importa o TestDisplayComponent para usá-lo no template do AppComponent
import { TestDisplayComponent } from './test-display/test-display.component';

@Component({
  selector: 'app-root', // O seletor usado no index.html (<app-root></app-root>)
  standalone: true,    // Indica que este também é um componente standalone
  imports: [
    CommonModule,
    // RouterOutlet, // Descomente se estiver usando rotas
    TestDisplayComponent // Adiciona o TestDisplayComponent aos imports para poder usá-lo no template
  ],
  templateUrl: './app.html', // Caminho para o template HTML (ou app.html no seu caso)
  styleUrls: ['./app.scss']  // Caminho para os estilos (ou app.scss no seu caso)
})
export class AppComponent {
  // Você pode manter ou remover esta propriedade title.
  // Ela é geralmente usada no template padrão gerado pelo Angular CLI.
  title = 'meu-frontend-teste';
}