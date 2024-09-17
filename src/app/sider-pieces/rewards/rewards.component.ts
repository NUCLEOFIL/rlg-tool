import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Mission } from 'src/app/class/mission/mission';
import { CharacterReward } from 'src/app/class/rewards/character-reward/character-reward';
import { ObjectReward } from 'src/app/class/rewards/object-reward/object-reward';
import { ObjectsReward } from 'src/app/class/rewards/objects-reward/objects-reward';
import { RandomObjectsReward } from 'src/app/class/rewards/random-objects-reward/random-objects-reward';
import { SkillReward } from 'src/app/class/rewards/skill-reward/skill-reward';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { TracesService } from 'src/app/services/traces/traces.service';
import { UnityService } from 'src/app/services/unity/unity.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() piece: Task|Mission = new Task('normal');
  @Input() role?: Role;

  constructor(protected translate: TranslateService, protected tooltipService: TooltipService, protected pieceDetailsService: PieceDetailsService, public dialog: MatDialog, protected unityService: UnityService, private tracesService: TracesService) { }

  ngOnInit(): void {
  }

  formatTraceTarget(): string {
    let res: string = '';

    if (this.piece instanceof Task) {
      switch(this.piece.type) {
        case 'normal': res = 'Task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'annexe': res = 'Side_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'final': res = 'Final_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'optionnal': res = 'Opt_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'event': res = 'Event_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'repeat': res = 'Repeat_task_['+this.pieceDetailsService.pieceIndex+']'; break;
      }
    }
    if (this.piece instanceof Mission) {
      res = 'Mission_['+this.pieceDetailsService.pieceIndex+']';
    }

    return res;
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#CFE3B9', undefined, event.target.value));
    } else {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#CFE3B9'));
    }
  }

  getCharacterReward(index: number): CharacterReward {
    return this.piece.rewards[index] as CharacterReward;
  }

  getSkillReward(index: number): SkillReward {
    return this.piece.rewards[index] as SkillReward;
  }

  getObjectReward(index: number): ObjectReward {
    return this.piece.rewards[index] as ObjectReward;
  }

  getRandomObjectsReward(index: number): RandomObjectsReward {
    return this.piece.rewards[index] as RandomObjectsReward;
  }

  addObjectToRandomObjectsReward(reward: RandomObjectsReward, rewardIndex: number) {
    reward.addObject();
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+rewardIndex+']_object_['+(reward.objects.length-1)+']', this.formatTraceTarget(), '#CFE3B9', '*'));
  }

  removeObjectToRandomObjectsReward(reward: RandomObjectsReward, rewardIndex: number, objectIndex: number) {
    reward.removeObject(objectIndex);
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+(rewardIndex)+']_object_['+objectIndex+']', this.formatTraceTarget(), '#CFE3B9', '*'));
  }

  addReward(): void {
    this.piece.rewards.push(new ObjectReward());
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+(this.piece.rewards.length-1)+']', this.formatTraceTarget(), '#CFE3B9', '*'));
  }

  removeReward(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_reward_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.piece.rewards.splice(index, 1);
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+(this.piece.rewards.length-1)+']', this.formatTraceTarget(), '#CFE3B9', '*'));    
      } else {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'cancel_delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+(this.piece.rewards.length-1)+']', this.formatTraceTarget(), '#CFE3B9', '*'));        
      }
    });
  }

  changeRewardType(index: number, type: string): void {
    switch(type) {
      case 'object': this.piece.rewards[index] = new ObjectsReward();
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[ObjectReward]',  this.formatTraceTarget(), '#CFE3B9', '*'));
        break;
      case 'skill': this.piece.rewards[index] = new SkillReward();
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[SkillReward]',  this.formatTraceTarget(), '#CFE3B9', '*'));
        break;
      case 'character': this.piece.rewards[index] = new CharacterReward();
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[CharacterReward]',  this.formatTraceTarget(), '#CFE3B9', '*')); 
        break;
      case 'randomObjects': this.piece.rewards[index] = new RandomObjectsReward();
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[RandomObjectsReward]',  this.formatTraceTarget(), '#CFE3B9', '*')); 
        break;
    }
  }
}
