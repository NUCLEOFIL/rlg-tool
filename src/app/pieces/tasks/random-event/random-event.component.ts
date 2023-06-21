import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Task } from 'src/app/class/task/task';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';

@Component({
  selector: 'app-random-event',
  templateUrl: './random-event.component.html',
  styleUrls: ['./random-event.component.scss']
})
export class RandomEventComponent implements OnInit {

  displayMenu: string = 'hide';
  displaySymbolChoice: string = 'hide';
  displayPrequires: string = 'hide';

  pieceWidth: string = '400px';

  @Input() task: Task = new Task('normal');
  @Input() mission!: Mission;
  @Input() role!: Role;
  @Input() i!: number;
  @Input() j!: number;

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
}
