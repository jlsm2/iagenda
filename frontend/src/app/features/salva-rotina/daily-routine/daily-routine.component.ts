// src/app/pages/daily-routine/daily-routine.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Importe o botão que já criamos!


// Interface para definir a estrutura de uma atividade da rotina
export interface Atividade {
  titulo: string;
  horario: string;
  emoji: string;
  realizada: boolean;
  cor: string; // Cor principal para o botão de check
  corFundo: string; // Cor de fundo do item
}

@Component({
  selector: 'app-daily-routine',
  standalone: true,
  imports: [CommonModule, RouterModule], // Adicione o StatusButtonComponent aqui
  templateUrl: './daily-routine.component.html',
  styleUrls: ['./daily-routine.component.scss']
})
export class DailyRoutineComponent {
  // Array de dados simulando o que viria da sua API
  atividades: Atividade[] = [
    { titulo: 'Acordar', horario: '6:00', emoji: '🛏️', realizada: true, cor: '#a384e0', corFundo: '#f3eefc' },
    { titulo: 'Café da manhã', horario: '6:30', emoji: '🥐', realizada: true, cor: '#89d19f', corFundo: '#eef9f2' },
    { titulo: 'Academia', horario: '7:00', emoji: '🏋️', realizada: true, cor: '#83bde5', corFundo: '#eef6fb' },
    { titulo: 'Tomar banho', horario: '7:45', emoji: '🚿', realizada: true, cor: '#89d19f', corFundo: '#eef9f2' },
    { titulo: 'Ir para a faculdade', horario: '8:30', emoji: '🎓', realizada: true, cor: '#a384e0', corFundo: '#f3eefc' },
    { titulo: 'Almoçar', horario: '12:00', emoji: '🍽️', realizada: false, cor: '#89d19f', corFundo: '#eef9f2' },
    { titulo: 'Estudar', horario: '13:00', emoji: '📚', realizada: false, cor: '#e5c083', corFundo: '#fbf6ee' },
    { titulo: 'Reunião do projeto', horario: '15:00', emoji: '👥', realizada: false, cor: '#e58383', corFundo: '#fbeeee' },
  ];

  toggleStatus(atividade: Atividade) {
    atividade.realizada = !atividade.realizada;
    console.log(`Atividade '${atividade.titulo}' atualizada para: ${atividade.realizada}`);
    // TODO: Chamar o serviço que faz a requisição para o backend
  }
}