import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Task } from 'src/app/class/task/task';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';

@Component({
  selector: 'app-repeat-task',
  templateUrl: './repeat-task.component.html',
  styleUrls: ['./repeat-task.component.scss']
})
export class RepeatTaskComponent implements OnInit {

  displayMenu: string = 'hide';

  @Input() task: Task = new Task('normal');
  @Input() mission!: Mission;
  @Input() role!: Role;
  @Input() i!: number;
  @Input() j!: number;

  constructor(protected pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
  }

  onClickErase(): void {
    this.task.objective = '';
  } 

  onClickDots(): void {
    this.pieceDetailsService.piece = this.task;
    this.pieceDetailsService.parent = this.role;
  }

  onClickDelete(): void {
    this.role.removeTask(this.i, this.j);
    this.mission.equalizeLengths();
  }

  moveTask(direction: string): void {
    this.role.moveTask(this.i, this.j, direction);
    this.displayMenu = 'hide';
    this.mission.equalizeLengths();
  }

  canMoveTo(direction: string): boolean {
    let res: boolean = true;
    if (direction == 'left') {
      if (this.role.tasks[this.i][this.j-1] instanceof Task || this.j == 0) {
        res = false;
      }
    }
    return res;
  }
}
