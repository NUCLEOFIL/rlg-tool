import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/class/task/task';
import { Role } from 'src/app/class/role/role';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Trace } from 'src/app/class/trace/trace';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-supplementary-task',
  templateUrl: './supplementary-task.component.html',
  styleUrls: ['./supplementary-task.component.scss']
})
export class SupplementaryTaskComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() task: Task = new Task('normal');
  @Input() role: Role = new Role();

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService) { }

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
    if (this.task.supplementaryRole != undefined) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'Select_secondary_task',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#9AD5EC'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'Deselect_secondary_task',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#9AD5EC'));
    }
  }
}
