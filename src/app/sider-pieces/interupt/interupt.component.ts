import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-interupt',
  templateUrl: './interupt.component.html',
  styleUrls: ['./interupt.component.scss']
})
export class InteruptComponent implements OnInit {

  @Input() task: Task = new Task('normal');
  @Input() scenario: Scenario = new Scenario();

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
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#F7C9CF'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#F7C9CF'));
    }
  }
}
