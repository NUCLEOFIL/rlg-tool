import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Task } from 'src/app/class/task/task';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  displayMenu: string = 'hide';
  displaySymbolChoice: string = 'hide';
  displayPrequires: string = 'hide';

  pieceWidth: string = '400px';

  @Input() task: Task = new Task('normal');
  @Input() mission: Mission = new Mission();
  @Input() role!: Role;
  @Input() i!: number;
  @Input() j!: number;

  urlIcon: string = 'url("../../../../assets/background-images/tache.png")';

  constructor(protected pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
    this.durationChange();
  }
  
  durationChange(): void {
    /*
    if(this.task.durationUnit === 'UT') {
      if(this.task.duration >= 1 && this.task.duration <= 10) {
        this.pieceWidth = (this.task.duration*400)+'px';
      } else if(this.task.duration > 10) {
        this.pieceWidth = '4000px';
      } else {
        this.pieceWidth = '400px';
      }
    } else {
      this.pieceWidth = '400px';
    }
    */
  }

  onClickErase(): void {
    this.task.duration = 1;
    this.task.durationUnit = 'UT';
    this.task.identifier = '';
    this.task.objective = '';
    this.task.symbol.color = '';
    this.task.symbol.symbol = '';
  } 

  onClickDots(): void {
    this.pieceDetailsService.piece = this.task;
    this.pieceDetailsService.parent = this.role;
  }

  onClickChange(type: string): void {
    if (type == 'annexe') {
      this.task.symbol.color = '';
      this.task.symbol.symbol = '';
    }
    this.task.changeType(type);
  }

  onClickDelete(): void {
    this.role.removeTask(this.i, this.j);
    this.mission.equalizeLengths();
  }

  changeDisplaySymbolChoice(): void {
    if(this.displaySymbolChoice == 'show') {
      this.displaySymbolChoice = 'hide';
    } else {
      this.displaySymbolChoice = 'show';
    }
  }

  setSymbol(symbol: string, symbolColor: string): void {
    this.task.symbol.symbol = symbol;
    this.task.symbol.color = symbolColor;
    this.displaySymbolChoice = 'hide';
  }

  changeDisplayPrerequires(): void {
    if(this.displayPrequires == 'show') {
      this.displayPrequires = 'hide';
    } else {
      this.displayPrequires = 'show';
    }
  }

  canChangeInFinalTask(): boolean {
    let res: boolean = true;
    let lastTaskIndex: number = -1;
    for (let i = this.role.tasks[this.i].length - 1; i >= 0; i--) {
      if (this.role.tasks[this.i][i] instanceof Task) {
        lastTaskIndex = i;
        break;
      }
    }
    if (this.j < lastTaskIndex || this.role.tasks[this.i].some(task => task?.type == 'final') || this.role.tasks[this.i].some(task => task?.type == 'repeat')) {
      res = false;
    }
    return res;
  }

  moveTask(direction: string): void {
    this.role.moveTask(this.i, this.j, direction);
    this.displayMenu = 'hide';
    this.displayPrequires = 'hide';
    this.displaySymbolChoice = 'hide';
    this.mission.equalizeLengths();
  }

  canMoveTo(direction: string): boolean {
    let res: boolean = true;
    if (direction == 'left') {
      if (this.j == 0) {
        res = false;
      }
    } else if (direction == 'right') {
      if (this.role.tasks[this.i][this.j+1]?.type == 'final' || this.role.tasks[this.i][this.j+1]?.type == 'repeat') {
        res = false;
      }
    }
    return res;
  }

  findFirstIndexOfTaskType(type: string): number[] {
    for(let i = 0; i < this.role.tasks.length; i++) {
      for(let j = 0; j < this.role.tasks[i].length; j++) {
        if (this.role.tasks[i][j] instanceof Task && this.role.tasks[i][j]?.type == type) {
          return [i, j];
        }
      }
    }
    return [0, 0];
  } 
}


