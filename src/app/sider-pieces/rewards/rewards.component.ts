import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CharacterReward } from 'src/app/class/rewards/character-reward/character-reward';
import { ObjectReward } from 'src/app/class/rewards/object-reward/object-reward';
import { ObjectsReward } from 'src/app/class/rewards/objects-reward/objects-reward';
import { SkillReward } from 'src/app/class/rewards/skill-reward/skill-reward';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() task: Task = new Task('normal');
  @Input() role: Role = new Role();

  constructor(protected translate: TranslateService, protected tooltipService: TooltipService, protected pieceDetailsService: PieceDetailsService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  formatTraceTarget(): string {
    let res: string = '';

    if (this.pieceDetailsService.piece instanceof Task) {
      switch(this.pieceDetailsService.piece.type) {
        case 'normal': res = 'Task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'annexe': res = 'Side_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'final': res = 'Final_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'optionnal': res = 'Opt_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'event': res = 'Event_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'repeat': res = 'Repeat_task_['+this.pieceDetailsService.pieceIndex+']'; break;
      }
    }

    return res;
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#CFE3B9', undefined, event.target.value));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#CFE3B9'));
    }
  }

  getCharacterReward(index: number): CharacterReward {
    return this.task.rewards[index] as CharacterReward;
  }

  getSkillReward(index: number): SkillReward {
    return this.task.rewards[index] as SkillReward;
  }

  getObjectReward(index: number): ObjectReward {
    return this.task.rewards[index] as ObjectReward;
  }

  addReward(): void {
    this.task.rewards.push(new ObjectReward());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+this.task.rewards.length+']', this.formatTraceTarget(), '#CFE3B9', '*'));
  }

  removeReward(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_reward_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.task.rewards.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+this.task.rewards.length+']', this.formatTraceTarget(), '#CFE3B9', '*'));    
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+this.task.rewards.length+']', this.formatTraceTarget(), '#CFE3B9', '*'));        
      }
    });
  }

  changeRewardType(index: number, type: string): void {
    switch(type) {
      case 'object': this.task.rewards[index] = new ObjectsReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[ObjectReward]',  this.formatTraceTarget(), '#CFE3B9', '*'));
        break;
      case 'skill': this.task.rewards[index] = new SkillReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[SkillReward]',  this.formatTraceTarget(), '#CFE3B9', '*'));
        break;
      case 'character': this.task.rewards[index] = new CharacterReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[CharacterReward]',  this.formatTraceTarget(), '#CFE3B9', '*')); 
        break;
    }
  }
}
