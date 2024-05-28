import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Discussion } from 'src/app/class/discussion/discussion';
import { Response } from 'src/app/class/response/response';
import { Role } from 'src/app/class/role/role';
import { DeclarativeSentence } from 'src/app/class/sentence/declarativeSentence/declarative-sentence';
import { InterrogativeSentence } from 'src/app/class/sentence/interrogativeSentence/interrogative-sentence';
import { Sentence } from 'src/app/class/sentence/sentence';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { SuppressDialogComponent } from '../suppress-dialog/suppress-dialog.component';
import { QuestReward } from 'src/app/class/rewards/quest-reward/quest-reward';
import { Scenario } from 'src/app/class/scenario/scenario';

@Component({
  selector: 'app-discussion-dialog',
  templateUrl: './discussion-dialog.component.html',
  styleUrls: ['./discussion-dialog.component.scss']
})
export class DiscussionDialogComponent implements OnInit {

  role: Role;
  discussion: Discussion;
  scenario: Scenario;

  constructor(public dialogRef: MatDialogRef<DiscussionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDiscussionData, protected translate: TranslateService, protected tooltipService: TooltipService, public dialog: MatDialog) {
      this.role = this.data.role;
      this.discussion = this.data.discussion;
      this.scenario = this.data.scenario;
    }

  ngOnInit(): void {
  }

  isDeclarativeSentence(sentence: Sentence): boolean {
    return sentence instanceof DeclarativeSentence;
  }

  isInterrogativeSentence(sentence: Sentence): boolean {
    return sentence instanceof InterrogativeSentence;
  }

  getSentenceAsDeclarativeSentence(sentence: Sentence): DeclarativeSentence {
    return sentence as DeclarativeSentence;
  }

  getSentenceAsInterrogativeSentence(sentence: Sentence): InterrogativeSentence {
    return sentence as InterrogativeSentence;
  }

  onCheckFirstSentence(event: any, sentenceId: number) {
    if (event.target.checked) {
      this.discussion.firstSentenceID = sentenceId;
    } else {
      this.discussion.firstSentenceID = -1;
    }
  }

  isSelectableAsFirstDiscussion(): boolean {
    let res: boolean = true;
    this.role.discussions.forEach(discussion => {
      if (discussion.character == this.discussion.character && discussion.ID != this.discussion.ID && discussion.isFirstDiscussion) {
        res = false;
      }
    });
    return res;
  }

  addDeclarativeSentence() {
    let newSentence: DeclarativeSentence = new DeclarativeSentence(this.role.actualSentenceID++);
    newSentence.idDiscussion = this.discussion.ID;
    this.discussion.sentences.push(newSentence.ID);
    this.role.sentences.push(newSentence);
  }

  deleteDeclarativeSentence(removedSentenceId: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('discussion_declarativeSentence_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.sentences.forEach((sentence, index) => {
          if (sentence.ID == removedSentenceId) {
            this.role.sentences.splice(index,1);
          }
          if (sentence instanceof DeclarativeSentence) {
            if (sentence.nextSentence == removedSentenceId) {
              //resetNextSentence
              sentence.nextSentence = -1;
            }
          }
          if (sentence instanceof InterrogativeSentence) {
            this.role.responses.forEach(response => {
              if (response.nextSentence == removedSentenceId) {
                //resetNextSentence
                response.nextSentence = -1;
              }
            });
          }
        });        
      }
      if (this.discussion.firstSentenceID == removedSentenceId) {
        this.discussion.firstSentenceID = -1;
      }
    });
  }

  addInterrogativeSentence() {
    let newSentence: InterrogativeSentence = new InterrogativeSentence(this.role.actualSentenceID++);
    newSentence.idDiscussion = this.discussion.ID;
    
    let newResponse: Response = new Response(this.role.actualResponseID++);
    newResponse.idInterrogativeSentence = newSentence.ID;
    newSentence.responses.push(newResponse.ID);
    this.role.responses.push(newResponse);

    this.discussion.sentences.push(newSentence.ID);
    this.role.sentences.push(newSentence);
  }

  deleteInterrogativeSentence(removedSentenceId: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('discussion_interrogativeSentence_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        for (let sentenceIndex: number = 0; sentenceIndex < this.role.sentences.length; sentenceIndex++) {
          let sentence: Sentence = this.role.sentences[sentenceIndex];
          if (sentence instanceof DeclarativeSentence && sentence.nextSentence == removedSentenceId) {
            sentence.nextSentence = -1;
          }
          if (sentence instanceof InterrogativeSentence) {
            if (sentence.ID == removedSentenceId) {
              for (let responseIndex: number = 0; responseIndex < this.role.responses.length; responseIndex++) {
                let response: Response = this.role.responses[responseIndex];
                if (response.idInterrogativeSentence == removedSentenceId) {
                  this.role.responses.splice(responseIndex,1);
                  responseIndex--;
                }
              }
              this.role.sentences.splice(sentenceIndex,1);
              sentenceIndex--;
            } else {
              for (let responseIndex: number = 0; responseIndex < this.role.responses.length; responseIndex++) {
                let response: Response = this.role.responses[responseIndex];
                if (response.nextSentence == removedSentenceId) {
                  response.nextSentence = -1;
                }
              }          
            }
          }
        }
        if (this.discussion.firstSentenceID == removedSentenceId) {
          this.discussion.firstSentenceID = -1;
        }
      }
    });
  }

  addResponse(sentence: InterrogativeSentence) {
    let newResponse: Response = new Response(this.role.actualResponseID++);
    newResponse.idInterrogativeSentence = sentence.ID;
    sentence.responses.push(newResponse.ID);
    this.role.responses.push(newResponse);
  }

  countResponses(sentenceId: number): number {
    let cpt: number = 0;
    this.role.responses.forEach(response => {
      if (response.idInterrogativeSentence == sentenceId) {
        cpt++;
      }
    });
    return cpt;
  }

  deleteResponse(sentence: InterrogativeSentence, removedResponseId: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('discussion_response_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        let sentenceResponseIndex = sentence.responses.findIndex(response => response == removedResponseId);
        sentence.responses.splice(sentenceResponseIndex,1);
        let responseIndex = this.role.responses.findIndex(response => response.ID == removedResponseId);
        this.role.responses.splice(responseIndex,1);      
      }
    });
  }
}

export interface DialogDiscussionData {
  role: Role;
  discussion: Discussion;
  scenario: Scenario;
}
