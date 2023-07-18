import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/class/comment/comment';
import { MatDialog } from '@angular/material/dialog';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';

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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.comment.answers.forEach(answer => {
      this.answerEditables.push(false);
    });
  }

  removeAnwer(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Réponse' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.comment.answers.splice(index, 1);
        this.answerEditables.splice(index, 1);
      }
    });
  }

  addAnswer(): void {
    if (this.newAnswer.length > 0) {
      this.comment.answers.push(this.newAnswer);
      this.answerEditables.push(false);
      this.newAnswer = '';      
    }
  }

  removeComment(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'ce Commentaire' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.comments.splice(index, 1);
      }
    });
  }
}
