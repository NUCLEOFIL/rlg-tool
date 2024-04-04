import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Task } from 'src/app/class/task/task';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Trace } from 'src/app/class/trace/trace';
import { MinimapService } from 'src/app/services/minimap/minimap.service';
import { TranslateService } from '@ngx-translate/core';
import { UnityService } from 'src/app/services/unity/unity.service';

@Component({
  selector: 'app-repeat-task',
  templateUrl: './repeat-task.component.html',
  styleUrls: ['./repeat-task.component.scss']
})
export class RepeatTaskComponent implements OnInit {

  displayMenu: string = 'hide';

  @Input() scenario: Scenario = new Scenario();
  @Input() task: Task = new Task('normal');
  @Input() mission!: Mission;
  @Input() missionIndex: number = 0;
  @Input() role!: Role;
  @Input() roleIndex: number = 0;
  @Input() i!: number;
  @Input() j!: number;

  urlIcon: string = 'url("./assets/background-images/repeatTask.png")';
  

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog, private minimapService: MinimapService, protected translate: TranslateService,
    protected unityService: UnityService) { }

  ngOnInit(): void {
    this.mission.equalizeLengths();
    this.minimapService.reset();
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('repeatTask_title') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.task.objective = '';
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.roleIndex,'all','Repeat_task_['+this.i+';'+this.j+']', '#B9DFE3'));
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.missionIndex,this.roleIndex,'all','Repeat_task_['+this.i+';'+this.j+']', '#B9DFE3'));
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
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('task_prefix')+' '+this.translate.instant('repeatTask_title') });
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
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.roleIndex,'all','Repeat_task_['+this.i+';'+this.j+']', '#B9DFE3'));
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.missionIndex,this.roleIndex,'all','Repeat_task_['+this.i+';'+this.j+']', '#B9DFE3'));
      }
    });
  }

  moveTask(direction: string): void {
    if (direction == 'left' && this.canMoveTo('left')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.mission.equalizeLengths();
    } else if (direction == 'top' && this.canMoveTo('top')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.mission.equalizeLengths();
    } else if (direction == 'right' && this.canMoveTo('right')) {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
      this.mission.equalizeLengths();
    } else if (direction == 'bottom') {
      this.role.moveTask(this.i, this.j, direction);
      this.displayMenu = 'hide';
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
      } else if (this.role.tasks[this.i - 1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
        let index: number = this.role.tasks[this.i - 1].findIndex(element => element?.type == 'final' || element?.type == 'repeat');
        if (index != this.j) {
          res = false;
        }
      }
    } else if (direction == 'bottom') {
      if (this.role.tasks[this.i + 1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
        let index: number = this.role.tasks[this.i + 1].findIndex(element => element?.type == 'final' || element?.type == 'repeat');
        if (index != this.j) {
          res = false;
        }
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

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.missionIndex,this.roleIndex,source,'Repeat_task_['+this.i+';'+this.j+']', '#B9DFE3'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.roleIndex,source,'Repeat_task_['+this.i+';'+this.j+']', '#B9DFE3'));
    }
  }

  editMoveTrace(event: any, source: string): void {
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'move',this.missionIndex,this.roleIndex,source,'Repeat_task_['+this.i+';'+this.j+']', '#B9DFE3'));
  }
}
