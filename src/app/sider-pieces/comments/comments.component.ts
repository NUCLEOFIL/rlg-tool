import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Step } from 'src/app/class/step/step';
import { Task } from 'src/app/class/task/task';
import { Comment } from 'src/app/class/comment/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() piece!: (Role | Task | Mission | Step | Scenario);
  newComment: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  addComment(): void {
    if (this.newComment.length > 0) {
      let comment = new Comment();
      comment.content = this.newComment;
      this.newComment = '';
      this.piece.comments.push(comment);      
    }
  }
}
