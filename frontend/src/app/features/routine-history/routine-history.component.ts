import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutineFacade } from '../../facades/routine.facade';

@Component({
  selector: 'app-routine-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './routine-history.component.html',
  styleUrls: ['./routine-history.component.scss']
})
export class RoutineHistoryComponent implements OnInit {
  routines$!: Observable<any[]>;

  constructor(
    private routineFacade: RoutineFacade,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routines$ = this.routineFacade.userRoutines$;
    this.routineFacade.loadUserRoutines();
  }

  openRoutine(id: number): void {
    this.routineFacade.loadRoutineById(id);
  }

  goToPlanner(): void {
    this.router.navigate(['/planner']);
  }

  deleteRoutine(id: number, event: MouseEvent): void {
    event.stopPropagation(); // Evita que clique no X abra a rotina
    this.routineFacade.deleteRoutine(id, true); // Passa true para remover da lista local
  }
}
