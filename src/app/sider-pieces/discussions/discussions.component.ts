import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Character } from 'src/app/class/character/character';
import { Discussion } from 'src/app/class/discussion/discussion';
import { Response } from 'src/app/class/response/response';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { DeclarativeSentence } from 'src/app/class/sentence/declarativeSentence/declarative-sentence';
import { InterrogativeSentence } from 'src/app/class/sentence/interrogativeSentence/interrogative-sentence';
import { Sentence } from 'src/app/class/sentence/sentence';
import { DiscussionDialogComponent } from 'src/app/components/dialogs/discussion-dialog/discussion-dialog.component';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss']
})
export class DiscussionsComponent implements OnInit {

  selectedCharacter: Character | null = null;
  intitule: string = '';

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService, public dialog: MatDialog) { }

  @Input() scenario: Scenario = new Scenario();
  @Input() role: Role = new Role();

  ngOnInit(): void {
  }

  addDiscussion() {
    if (this.selectedCharacter && this.intitule) {
      let discussion = new Discussion(this.role.actualDiscussionID++, this.selectedCharacter, this.intitule);
      this.intitule = '';
      this.role.discussions.push(discussion);
      const dialogRef = this.dialog.open(DiscussionDialogComponent, {
        width: '60vw',
        data: { role: this.role, discussion: discussion }
      });
    }
  }

  openDiscussion(discussion: Discussion) {
    const dialogRef = this.dialog.open(DiscussionDialogComponent, {
      width: '60vw',
      data: { role: this.role, discussion: discussion }
    });
  }

  deleteDiscussion(discussionIndex: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('discussion_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        let discussion: Discussion = this.role.discussions[discussionIndex];
        for (let sentenceIndex: number = 0; sentenceIndex < this.role.sentences.length; sentenceIndex++) {
          let sentence: Sentence = this.role.sentences[sentenceIndex];
          if (discussion.ID == sentence.idDiscussion) {
            if (sentence instanceof InterrogativeSentence) {
              for (let responseIndex: number = 0; responseIndex < this.role.responses.length; responseIndex++) {
                let response: Response = this.role.responses[responseIndex];
                if (response.idInterrogativeSentence == sentence.ID) {
                  this.role.responses.splice(responseIndex,1);
                  responseIndex--;
                }
              }
            }
            this.role.sentences.splice(sentenceIndex,1);
            sentenceIndex--;
          }
        }
        this.role.discussions.splice(discussionIndex,1);
      }
    });
  } 
}

