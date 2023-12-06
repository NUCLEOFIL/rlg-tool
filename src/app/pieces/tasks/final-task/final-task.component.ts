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
import { MatSnackBar } from '@angular/material/snack-bar';
import { IdentifierSnackbarComponent } from 'src/app/components/snackbars/identifier-snackbar/identifier-snackbar.component';
import { Trace } from 'src/app/class/trace/trace';
import { MinimapService } from 'src/app/services/minimap/minimap.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-final-task',
  templateUrl: './final-task.component.html',
  styleUrls: ['./final-task.component.scss']
})
export class FinalTaskComponent implements OnInit {

  displayMenu: string = 'hide';
  displaySymbolChoice: string = 'hide';
  displayPrequires: string = 'hide';

  pieceWidth: number = 400;

  @Input() task: Task = new Task('normal');
  @Input() scenario: Scenario = new Scenario();
  @Input() mission!: Mission;
  @Input() missionIndex: number = 0;
  @Input() role!: Role;
  @Input() roleIndex: number = 0;
  @Input() i!: number;
  @Input() j!: number;

  urlIcon: string = 'url("./assets/background-images/final.png")';
  antecedent: boolean = false;

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog,
    private _snackBar: MatSnackBar, private minimapService: MinimapService, protected translate: TranslateService) { }

  ngOnInit(): void {
    this.setPieceWidth();
    this.mission.equalizeLengths();
    this.minimapService.reset();
  }
  
  durationChange(): void {
    let beforeWidth: number = this.pieceWidth;
    this.setPieceWidth();
    let afterWidth: number = this.pieceWidth;
    let difference: number;
    // Increase
    if (beforeWidth < afterWidth) {
      difference = (afterWidth/beforeWidth)-1;
      for(let k = 0; k < difference; k++) {
        if (!(this.role.tasks[this.i][this.j+k+1] instanceof Task)) {
          this.role.tasks[this.i].splice(this.j+k+1, 1);
        }
      }
    }
    // Decrease
    if (afterWidth < beforeWidth) {
      difference = (beforeWidth/afterWidth)-1
      for (let k = 0; k < difference; k++) {
        this.role.tasks[this.i].splice(this.j+k+1, 0, null);
      }
    }
    this.mission.equalizeLengths();
    this.minimapService.reset();
  }

  setPieceWidth(): void {
    if(this.task.durationUnit === 'UT') {
      if(this.task.duration >= 1 && this.task.duration <= 10) {
        this.pieceWidth = (this.task.duration*400);
      } else if(this.task.duration > 10) {
        this.pieceWidth = 4000;
      } else {
        this.pieceWidth = 400;
      }
    } else {
      this.pieceWidth = 400;
    }
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('finalTask_title') });
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
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.roleIndex,'all','Final_task_['+this.i+';'+this.j+']', '#B28386'));
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.missionIndex,this.roleIndex,'all','Final_task_['+this.i+';'+this.j+']', '#B28386'));
      }
    });
  } 

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.task;
    this.pieceDetailsService.parent = this.role;
    this.pieceDetailsService.missionIndex = this.missionIndex;
    this.pieceDetailsService.roleIndex = this.roleIndex;
    this.pieceDetailsService.pieceIndex = [this.i,this.j];
  }

  onClickChange(type: string): void {
    if (type == 'annexe') {
      this.task.symbol.color = '';
      this.task.symbol.symbol = '';
    }
    this.task.changeType(type);
    this.mission.equalizeLengths();
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform_into_['+type+']',this.missionIndex,this.roleIndex,'all','Final_task_['+this.i+';'+this.j+']', '#B28386'));
  }

  onClickDelete(): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('task_prefix')+' '+this.translate.instant('finalTask_title') });
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
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.roleIndex,'all','Final_task_['+this.i+';'+this.j+']', '#B28386'));
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.missionIndex,this.roleIndex,'all','Final_task_['+this.i+';'+this.j+']', '#B28386'));
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
    if (symbol != '' && symbolColor != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'select_common',this.missionIndex,this.roleIndex,'symbol','Final_task_['+this.i+';'+this.j+']', '#B28386'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete_common',this.missionIndex,this.roleIndex,'symbol','Final_task_['+this.i+';'+this.j+']', '#B28386'));
    }
  }
  
  canUseSymbol(symbol: string, symbolColor: string): string {
    let res: string = 'enable';
      this.role.tasks.forEach(inlineTasks => {
        if (inlineTasks.some(task => task?.symbol.symbol == symbol && task?.symbol.color == symbolColor)) {
          res = 'disable';
        }
      });
    return res;
  }

  changeDisplayPrerequires(): void {
    if(this.displayPrequires == 'show') {
      this.displayPrequires = 'hide';
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'hide',this.missionIndex,this.roleIndex,'prerequires','Final_task_['+this.i+';'+this.j+']', '#B28386'));
    } else {
      this.displayPrequires = 'show';
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'show',this.missionIndex,this.roleIndex,'prerequires','Final_task_['+this.i+';'+this.j+']', '#B28386'));
    }
  }

  moveTask(direction: string): void {
    if (direction == 'left' && this.canMoveTo('left')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
    } else if (direction == 'top' && this.canMoveTo('top')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
    } else if (direction == 'right' && this.canMoveTo('right')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
    } else if (direction == 'bottom') {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
    }
  }

  canMoveTo(direction: string): boolean {
    let res: boolean = true;
    if (direction == 'left') {
      if (this.role.tasks[this.i][this.j-1] instanceof Task || this.j == 0) {
        res = false;
      }
    } else if (direction == 'top') {
      if (this.i == 0) {
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
    if (this.role.isAlreadyUsedIdentifier(this.task.identifier)) {
      this._snackBar.openFromComponent(IdentifierSnackbarComponent, { duration: 5000 });
      this.task.identifier = '';  
    }
    this.editTrace(event,'Task_identifier');
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
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.missionIndex,this.roleIndex,'prerequire_task','Final_task_['+this.i+';'+this.j+']', '#B28386'));
  }

  onUncheckTask(task: Task): void {
    let i: number = this.task.prerequireTasks.findIndex(element => element.identifier == task.identifier);
    this.task.prerequireTasks.splice(i,1);
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.roleIndex,'prerequire_task','Final_task_['+this.i+';'+this.j+']', '#B28386'));
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
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.missionIndex,this.roleIndex,'prerequire_ressource','Final_task_['+this.i+';'+this.j+']', '#B28386'));
  }

  onUncheckRessource(ressource: Ressource): void {
    let i: number = this.task.prerequireRessources.findIndex(element => ressource == element.ressource);
    this.task.prerequireRessources.splice(i, 1);
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.roleIndex,'prerequire_ressource','Final_task_['+this.i+';'+this.j+']', '#B28386'));
  }

  getAssociatePrerequireRessource(ressource: Ressource): PrerequireRessource {
    let i: number = this.task.prerequireRessources.findIndex(element => ressource == element.ressource);
    return this.task.prerequireRessources[i];
  }
  
  hasPossibleAntecedents(): boolean {
    let res = false;
    this.role.tasks.forEach(inlineTask => {
      for(let i = 0; i < inlineTask.length; i++) {
        if (inlineTask[i]?.identifier && (this.task.identifier != inlineTask[i]?.identifier)) {
          res = true;
        }
      }
    });
    return res;
  }
  
  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.missionIndex,this.roleIndex,source,'Final_task_['+this.i+';'+this.j+']', '#B28386'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.roleIndex,source,'Final_task_['+this.i+';'+this.j+']', '#B28386'));
    }
  }

  editMoveTrace(event: any, source: string): void {
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'move',this.missionIndex,this.roleIndex,source,'Final_task_['+this.i+';'+this.j+']', '#B28386'));
  }
}
