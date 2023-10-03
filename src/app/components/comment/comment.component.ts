import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/class/comment/comment';
import { MatDialog } from '@angular/material/dialog';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Mission } from 'src/app/class/mission/mission';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Task } from 'src/app/class/task/task';
import { Role } from 'src/app/class/role/role';
import { Step } from 'src/app/class/step/step';
import { Trace } from 'src/app/class/trace/trace';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() comments: Comment[] = [];
  @Input() index: number = 0;
  @Input() comment: Comment = new Comment();
  answerEditables: boolean[] = [];
  isEditable: boolean = false;
  newAnswer: string = '';

  constructor(public dialog: MatDialog, private pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
    this.comment.answers.forEach(answer => {
      this.answerEditables.push(false);
    });
  }

  removeAnswer(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Réponse' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.comment.answers.splice(index, 1);
        this.answerEditables.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'answer_['+index+']',this.formatTraceTarget(),'#F3ED97'));
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'answer_['+index+']',this.formatTraceTarget(),'#F3ED97'));
      }
    });
  }

  addAnswer(): void {
    if (this.newAnswer.length > 0) {
      this.comment.answers.push(this.newAnswer);
      this.answerEditables.push(false);
      this.newAnswer = '';
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'answer_['+(this.comment.answers.length-1)+']',this.formatTraceTarget(),'#F3ED97'));
    }
  }

  removeComment(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'ce Commentaire' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.comments.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'all',this.formatTraceTarget(),'#F3ED97'));
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'all',this.formatTraceTarget(),'#F3ED97'));
      }
    });
  }

  formatTraceTarget(): string {
    let res: string = '';

    if (this.pieceDetailsService.piece instanceof Scenario) {
      res = 'Scenario';
    }
    if (this.pieceDetailsService.piece instanceof Mission) {
      res = 'Mission_['+this.pieceDetailsService.missionIndex+']';
    }
    if (this.pieceDetailsService.piece instanceof Role) {
      res = 'Role_['+this.pieceDetailsService.roleIndex+']';
    }
    if (this.pieceDetailsService.piece instanceof Step) {
      if (this.pieceDetailsService.roleIndex == undefined) {
        res = 'Step_m_['+this.pieceDetailsService.pieceIndex+']';
      } else {
        res = 'Step_r_['+this.pieceDetailsService.pieceIndex+']';
      }
    }
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

    return res+'_comment_['+this.index+']';
  }
  
  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#F3ED97'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source,this.formatTraceTarget(), '#F3ED97'));
    }
  }
}
