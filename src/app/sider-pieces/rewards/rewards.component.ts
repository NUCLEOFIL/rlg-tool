import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
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

  constructor(protected translate: TranslateService, protected tooltipService: TooltipService, protected pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
  }

  resetReward(event: any) {
    this.task.resetReward();
    this.editTrace(event, 'task_reward');
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
    if (this.task.reward != undefined) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'Select_task_reward_'+this.task.rewardType,this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#CFE3B9'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'Deselect_task_reward',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#CFE3B9'));
    }
  }
}
