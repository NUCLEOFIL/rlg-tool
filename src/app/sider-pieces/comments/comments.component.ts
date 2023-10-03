import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Step } from 'src/app/class/step/step';
import { Task } from 'src/app/class/task/task';
import { Comment } from 'src/app/class/comment/comment';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { Trace } from 'src/app/class/trace/trace';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() piece!: (Role | Task | Mission | Step | Scenario);
  @Input() scenario: Scenario = new Scenario();
  newComment: string = '';

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
  }

  addComment(): void {
    if (this.newComment.length > 0) {
      let comment = new Comment();
      comment.content = this.newComment;
      this.newComment = '';
      this.piece.comments.push(comment);  
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',
        this.pieceDetailsService.missionIndex,
        this.pieceDetailsService.roleIndex,
        'all',
        this.formatTraceTarget(),
        '#F3ED97'
      ));    
    }
  }

  formatTraceTarget(): string {
    let res: string = '';

    if (this.piece instanceof Scenario) {
      res = 'Scenario';
    }
    if (this.piece instanceof Mission) {
      res = 'Mission_['+this.pieceDetailsService.missionIndex+']';
    }
    if (this.piece instanceof Role) {
      res = 'Role_['+this.pieceDetailsService.roleIndex+']';
    }
    if (this.piece instanceof Step) {
      if (this.pieceDetailsService.roleIndex == undefined) {
        res = 'Step_m_['+this.pieceDetailsService.pieceIndex+']';
      } else {
        res = 'Step_r_['+this.pieceDetailsService.pieceIndex+']';
      }
    }
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

    return res+'_comment_['+(this.piece.comments.length-1)+']';
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#F3ED97'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#F3ED97'));
    }
  }
}
