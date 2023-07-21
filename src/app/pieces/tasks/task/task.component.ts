import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { PrerequireRessource } from 'src/app/class/prerequires/prerequire-ressource/prerequire-ressource';
import { PrerequireTask } from 'src/app/class/prerequires/prerequire-task/prerequire-task';
import { Ressource } from 'src/app/class/ressource/ressource';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';

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
  @Input() scenario: Scenario = new Scenario();
  @Input() mission: Mission = new Mission();
  @Input() role!: Role;
  @Input() i!: number;
  @Input() j!: number;

  urlIcon: string = 'url("../../../../assets/background-images/tache.png")';

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog) { }

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
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Tâche' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.task.duration = 1;
        this.task.durationUnit = 'UT';
        this.task.identifier = '';
        this.task.objective = '';
        this.task.symbol.color = '';
        this.task.symbol.symbol = '';
        this.task.prerequireRessources = [];
        this.task.prerequireTasks = [];   
        this.role.tasks.forEach(inlineTasks => {
          inlineTasks.forEach(task => {
            task?.prerequireTasks.forEach((prerequire, index) => {
              if (prerequire.identifier == this.task.identifier) {
                task.prerequireTasks.splice(index, 1);
              }
            });
          });
        });
      }
    });
  } 

  onClickPiece(): void {
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
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Tâche' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.tasks.forEach(inlineTasks => {
          inlineTasks.forEach(task => {
            task?.prerequireTasks.forEach((prerequire, index) => {
              if (prerequire.identifier == this.task.identifier) {
                task.prerequireTasks.splice(index, 1);
              }
            });
          });
        });
        this.role.removeTask(this.i, this.j);
        this.mission.equalizeLengths();
      }
    });
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
    } else if (direction == 'top') {
      if (this.i == 0) {
        res = false;
      } else if (this.role.tasks[this.i-1].slice(0, this.j).some(element => element?.type == 'final' || element?.type == 'repeat')) {
        res = false;
      } else if (this.role.tasks[this.i].some(element => element?.type == 'final' || element?.type == 'repeat') && (this.role.tasks[this.i-1][this.j]?.type == 'final' || this.role.tasks[this.i-1][this.j]?.type == 'repeat')) {
        res = false;
      }
    } else if (direction == 'bottom') {
      if (this.role.tasks[this.i+1].slice(0, this.j).some(element => element?.type == 'final' || element?.type == 'repeat')) {
        res = false;
      } else if (this.role.tasks[this.i].some(element => element?.type == 'final' || element?.type == 'repeat') && (this.role.tasks[this.i+1][this.j]?.type == 'final' || this.role.tasks[this.i+1][this.j]?.type == 'repeat')) {
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

  changeIdentifier(event: any): void {
    let value: string = event.target.value;
    if (value != '') {
      this.role.tasks.forEach(inlineTasks => {
        inlineTasks.forEach(task => {
          task?.prerequireTasks.forEach(prerequire => {
            if (prerequire.identifier == this.task.identifier) {
              prerequire.identifier = value;
            }
          });
        });
      });
    } else {
      this.role.tasks.forEach(inlineTasks => {
        inlineTasks.forEach(task => {
          task?.prerequireTasks.forEach((prerequire, index) => {
            if (prerequire.identifier == this.task.identifier) {
              task.prerequireTasks.splice(index, 1);
            }
          });
        });
      }); 
    }
    this.task.identifier = value;
  }

  checkboxChangedTask(event: any, task:(Task|null)): void {
    if (task instanceof Task) {
      if (event.target.checked) {
        this.onCheckTask(task);
      } else {
        this.onUncheckTask(task);
      }      
    }
  }

  isCheckedTask(task: (Task|null)): boolean {
    if (task instanceof Task) {
      return this.task.prerequireTasks.some(element => element.identifier == task.identifier);
    }
    return false;
  }

  onCheckTask(task: Task): void {
    this.task.prerequireTasks.push(new PrerequireTask(task.identifier));
  }

  onUncheckTask(task: Task): void {
    let i: number = this.task.prerequireTasks.findIndex(element => element.identifier == task.identifier);
    this.task.prerequireTasks.splice(i,1);
  }

  checkboxChangedRessource(event: any, ressource: Ressource): void {
    if (event.target.checked) {
      this.onCheckRessource(ressource);
    } else {
      this.onUncheckRessource(ressource);
    }
  }

  isCheckedRessource(ressource: Ressource): boolean {
    return this.task.prerequireRessources.some(element => element.ressource == ressource);
  }

  onCheckRessource(ressource: Ressource): void {
    this.task.prerequireRessources.push(new PrerequireRessource(ressource));
  }

  onUncheckRessource(ressource: Ressource): void {
    let i: number = this.task.prerequireRessources.findIndex(element => ressource == element.ressource);
    this.task.prerequireRessources.splice(i, 1);
  }

  getAssociatePrerequireRessource(ressource: Ressource): PrerequireRessource {
    let i: number = this.task.prerequireRessources.findIndex(element => ressource == element.ressource);
    return this.task.prerequireRessources[i];
  }
}