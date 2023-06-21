import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/class/comment/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comments: Comment[] = [];
  @Input() index: number = 0;
  @Input() comment: Comment = new Comment();
  answerEditables: boolean[] = [];
  isEditable: boolean = false;
  newAnswer: string = '';

  constructor() { }

  ngOnInit(): void {
    this.comment.answers.forEach(answer => {
      this.answerEditables.push(false);
    });
  }

  removeAnwer(index: number): void {
    this.comment.answers.splice(index, 1);
    this.answerEditables.splice(index, 1);
  }

  addAnswer(): void {
    if (this.newAnswer.length > 0) {
      this.comment.answers.push(this.newAnswer);
      this.answerEditables.push(false);
      this.newAnswer = '';      
    }
  }

  removeComment(index: number): void {
    this.comments.splice(index, 1);
  }
}
