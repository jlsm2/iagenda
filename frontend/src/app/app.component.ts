import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. Importa o seu componente Navbar
import { Navbar } from './shared/navbar/navbar'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Adiciona o Navbar aos imports para que ele possa ser usado no template
  imports: [
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iAgenda';
}