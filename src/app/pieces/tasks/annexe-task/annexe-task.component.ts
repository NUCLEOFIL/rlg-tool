import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Trace } from 'src/app/class/trace/trace';
import { MinimapService } from 'src/app/services/minimap/minimap.service';
import { TranslateService } from '@ngx-translate/core';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';
import { UnityService } from 'src/app/services/unity/unity.service';
import { CopyTaskService } from 'src/app/services/copyTask/copy-task.service';
import { TracesService } from 'src/app/services/traces/traces.service';

@Component({
  selector: 'app-annexe-task',
  templateUrl: './annexe-task.component.html',
  styleUrls: ['./annexe-task.component.scss']
})
export class AnnexeTaskComponent implements OnInit {

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

  urlIcon: string = 'url("./assets/background-images/annexe.png")';
  antecedent: boolean = false;

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog,
    private _snackBar: MatSnackBar, private minimapService: MinimapService, protected translate: TranslateService, private tutorialService: TutorialService, protected unityService: UnityService,
    protected copyTaskService: CopyTaskService, private tracesService: TracesService) { }

  ngOnInit(): void {
    this.setPieceWidth();
    this.mission.equalizeLengths();
    this.minimapService.reset();
    if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 9) {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
      this.tutorialService.validPhase();
      if (this.tutorialService.isDone()) {
        this._snackBar.open(this.translate.instant('tutorial_finish'), '', { duration: 5000, panelClass: 'snackbar-success' });
      }
    }
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
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('task_prefix')+' '+this.translate.instant('annexeTask_title') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.task.duration = 1;
        this.task.durationUnit = 'UT';
        this.task.identifier = '';
        this.task.objective = '';
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
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'erase',this.missionIndex,this.roleIndex,'all','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
      } else {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'cancel_erase',this.missionIndex,this.roleIndex,'all','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
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

  onClickDelete(): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('task_prefix')+' '+this.translate.instant('annexeTask_title') });
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
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'delete',this.missionIndex,this.roleIndex,'all','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
      } else {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'cancel_delete',this.missionIndex,this.roleIndex,'all','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
      }
    });
  }

  onClickCopy() {
    this.copyTaskService.onClickCopy(this.scenario, this.role, this.task);
    this._snackBar.open(this.translate.instant('task_copy_snackbar'), '', { duration: 5000, panelClass: 'snackbar-success' });
  }

  onClickPaste() {
    let newTask: Task = this.copyTaskService.onClickPaste(this.scenario);
    this.role.tasks[this.i][this.j] = newTask;
    if (this.role.isAlreadyUsedIdentifier((this.role.tasks[this.i][this.j] as Task).identifier)) {
      this._snackBar.open(this.translate.instant('snackbar_identifier'), '', { duration: 5000, panelClass: 'snackbar-fail' });
      (this.role.tasks[this.i][this.j] as Task).identifier = '';
    }
  }

  onClickChange(type: string): void {
    this.task.changeType(type);
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'transform',this.missionIndex,this.roleIndex,'all','Side_task_['+this.i+';'+this.j+']_transform_into_['+type+']', '#BCCECC'));
  }

  changeDisplayPrerequires(): void {
    if(this.displayPrequires == 'show') {
      this.displayPrequires = 'hide';
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'hide',this.missionIndex,this.roleIndex,'prerequires','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
    } else {
      this.displayPrequires = 'show';
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'show',this.missionIndex,this.roleIndex,'prerequires','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
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
    if (direction == 'left' && this.canMoveTo('left')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'move',this.missionIndex,this.roleIndex,'Task_moveLeft','Side_task_['+this.i+';'+this.j+']', '#BCCECC',undefined,'['+(this.i-1)+';'+(this.j)+']'));
    } else if (direction == 'top' && this.canMoveTo('top')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'move',this.missionIndex,this.roleIndex,'Task_moveTop','Side_task_['+this.i+';'+this.j+']', '#BCCECC',undefined,'['+(this.i)+';'+(this.j-1)+']'));
    } else if (direction == 'right' && this.canMoveTo('right')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'move',this.missionIndex,this.roleIndex,'Task_moveRight','Side_task_['+this.i+';'+this.j+']', '#BCCECC',undefined,'['+(this.i+1)+';'+(this.j)+']'));
    } else if (direction == 'bottom') {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.displayPrequires = 'hide';
      this.displaySymbolChoice = 'hide';
      this.mission.equalizeLengths();
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'move',this.missionIndex,this.roleIndex,'Task_moveBottom','Side_task_['+this.i+';'+this.j+']', '#BCCECC',undefined,'['+(this.i)+';'+(this.j+1)+']'));
    }
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
      this._snackBar.open(this.translate.instant('snackbar_identifier'), '', { duration: 5000, panelClass: 'snackbar-fail' });
      this.task.identifier = '';
    }
    this.editTrace(event, 'Task_identifier');
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
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',this.missionIndex,this.roleIndex,'prerequire_task','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
  }

  onUncheckTask(task: Task): void {
    let i: number = this.task.prerequireTasks.findIndex(element => element.identifier == task.identifier);
    this.task.prerequireTasks.splice(i,1);
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'delete',this.missionIndex,this.roleIndex,'prerequire_task','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
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
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',this.missionIndex,this.roleIndex,'prerequire_ressource','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
  }

  onUncheckRessource(ressource: Ressource): void {
    let i: number = this.task.prerequireRessources.findIndex(element => ressource == element.ressource);
    this.task.prerequireRessources.splice(i, 1);
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'delete',this.missionIndex,this.roleIndex,'prerequire_ressource','Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
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
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'write',this.missionIndex,this.roleIndex,source,'Side_task_['+this.i+';'+this.j+']', '#BCCECC', undefined, event.target.value));
    } else {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'erase',this.missionIndex,this.roleIndex,source,'Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
    }
  }

  editMoveTrace(event: any, source: string): void {
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'move',this.missionIndex,this.roleIndex,source,'Side_task_['+this.i+';'+this.j+']', '#BCCECC'));
  }

  addCombineObject(): void {
    this.task.combineObjects.push([null,1]);
  }

  removeCombineObject(index: number): void {
    this.task.combineObjects.splice(index,1);
  }

  addExchangeGiveObject(): void {
    this.task.giveObjects.push([null,1]);
  }

  removeExchangeGiveObject(index: number): void {
    this.task.giveObjects.splice(index,1);
  }

  addExchangeReceiveObject(): void {
    this.task.receiveObjects.push([null,1]);
  }

  removeExchangeReceiveObject(index: number): void {
    this.task.receiveObjects.splice(index,1);
  }
}
