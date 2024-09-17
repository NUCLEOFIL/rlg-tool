import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Character } from 'src/app/class/character/character';
import { Discussion } from 'src/app/class/discussion/discussion';
import { Mission } from 'src/app/class/mission/mission';
import { Response } from 'src/app/class/response/response';
import { DiscussionReward } from 'src/app/class/rewards/discussion-reward/discussion-reward';
import { Reward } from 'src/app/class/rewards/reward';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { DeclarativeSentence } from 'src/app/class/sentence/declarativeSentence/declarative-sentence';
import { InterrogativeSentence } from 'src/app/class/sentence/interrogativeSentence/interrogative-sentence';
import { Sentence } from 'src/app/class/sentence/sentence';
import { Trace } from 'src/app/class/trace/trace';
import { DiscussionDialogComponent } from 'src/app/components/dialogs/discussion-dialog/discussion-dialog.component';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { TracesService } from 'src/app/services/traces/traces.service';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss']
})
export class DiscussionsComponent implements OnInit {

  selectedCharacter: Character | null = null;
  intitule: string = '';

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService, public dialog: MatDialog, private tracesService: TracesService) { }

  @Input() scenario: Scenario = new Scenario();
  @Input() role: Role = new Role();

  ngOnInit(): void {
  }

  addDiscussion() {
    if (this.selectedCharacter && this.intitule) {
      let discussionID: number = this.role.actualDiscussionID++;
      let discussion = new Discussion(discussionID, this.selectedCharacter, this.intitule);
      this.intitule = '';
      this.role.discussions.push(discussion);
      const dialogRef = this.dialog.open(DiscussionDialogComponent, {
        width: '60vw',
        data: { role: this.role, discussion: discussion, scenario: this.scenario }
      });
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'new', this.pieceDetailsService.missionIndex, this.pieceDetailsService.roleIndex, 'all', 'discussion_['+discussionID+']', '#D5D5FF'));
    }
  }

  openDiscussion(discussion: Discussion) {
    const dialogRef = this.dialog.open(DiscussionDialogComponent, {
      width: '60vw',
      data: { role: this.role, discussion: discussion, scenario: this.scenario }
    });
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'open_discussion', this.pieceDetailsService.missionIndex, this.pieceDetailsService.roleIndex, 'all', 'discussion_['+discussion.ID+']', '#D5D5FF'));
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

        for (let rewardIndex: number = 0; rewardIndex < this.role.rewards.length; rewardIndex++) {
          let reward: Reward = this.role.rewards[rewardIndex];
          if (reward.type == 'discussion') {
            if ((reward as DiscussionReward).discussionId == discussion.ID) {
              this.role.rewards.splice(rewardIndex,1);
              rewardIndex--;
            }
          }
        }
        this.role.discussions.forEach(discuss => {
          for (let rewardIndex: number = 0; rewardIndex < discuss.rewards.length; rewardIndex++) {
            let reward: Reward = discuss.rewards[rewardIndex];
            if (reward.type == 'discussion') {
              if ((reward as DiscussionReward).discussionId == discussion.ID) {
                discuss.rewards.splice(rewardIndex,1);
                rewardIndex--;
              }
            }
          }
        });
        this.role.sentences.forEach(sentence => {
          for (let rewardIndex: number = 0; rewardIndex < sentence.rewards.length; rewardIndex++) {
            let reward: Reward = sentence.rewards[rewardIndex];
            if (reward.type == 'discussion') {
              if ((reward as DiscussionReward).discussionId == discussion.ID) {
                sentence.rewards.splice(rewardIndex,1);
                rewardIndex--;
              }
            }
          }
        });
        this.role.discussions.forEach(response => {
          for (let rewardIndex: number = 0; rewardIndex < response.rewards.length; rewardIndex++) {
            let reward: Reward = response.rewards[rewardIndex];
            if (reward.type == 'discussion') {
              if ((reward as DiscussionReward).discussionId == discussion.ID) {
                response.rewards.splice(rewardIndex,1);
                rewardIndex--;
              }
            }
          }
        });
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'delete', this.pieceDetailsService.missionIndex, this.pieceDetailsService.roleIndex, 'all', 'discussion_['+discussion.ID+']', '#D5D5FF'));
      } 
    });
  } 

  editTrace(event: any, source: string, target: string): void {
    if (event.target.value != '') {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, source, target, '#D5D5FF', undefined, event.target.value));
    } else {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source, target, '#D5D5FF'));
    }
  }
}

