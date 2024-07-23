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
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Trace } from 'src/app/class/trace/trace';
import { CharacterReward } from 'src/app/class/rewards/character-reward/character-reward';
import { DiscussionReward } from 'src/app/class/rewards/discussion-reward/discussion-reward';
import { ObjectReward } from 'src/app/class/rewards/object-reward/object-reward';
import { SkillReward } from 'src/app/class/rewards/skill-reward/skill-reward';
import { RandomObjectsReward } from 'src/app/class/rewards/random-objects-reward/random-objects-reward';
import { UnityService } from 'src/app/services/unity/unity.service';

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
    @Inject(MAT_DIALOG_DATA) public data: DialogDiscussionData, protected translate: TranslateService, protected tooltipService: TooltipService, public dialog: MatDialog,
      private pieceDetailsService: PieceDetailsService, protected unityService: UnityService) {
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
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'all', 'declarativeSentence_[ID:'+newSentence.ID+']', '#D5D5FF'));
  }

  deleteDeclarativeSentence(removedSentenceId: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('discussion_declarativeSentence_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.discussions.forEach(discussion => {
          let sentenceIndex: number = discussion.sentences.findIndex(sentence => sentence == removedSentenceId);
          if (sentenceIndex != undefined) {
            discussion.sentences.splice(sentenceIndex,1);
          }
        });
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
        if (this.discussion.firstSentenceID == removedSentenceId) {
          this.discussion.firstSentenceID = -1;
        }
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'all', 'declarativeSentence_[ID:'+removedSentenceId+']', '#D5D5FF'));             
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
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'all', 'interrogativeSentence_[ID:'+newSentence.ID+']', '#D5D5FF'));
  }

  deleteInterrogativeSentence(removedSentenceId: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('discussion_interrogativeSentence_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.discussions.forEach(discussion => {
          let sentenceIndex: number = discussion.sentences.findIndex(sentence => sentence == removedSentenceId);
          if (sentenceIndex != undefined) {
            discussion.sentences.splice(sentenceIndex,1);
          }
        });
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
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'all', 'interrogativeSentence_[ID:'+removedSentenceId+']', '#D5D5FF'));
      }
    });
  }

  addResponse(sentence: InterrogativeSentence) {
    let newResponse: Response = new Response(this.role.actualResponseID++);
    newResponse.idInterrogativeSentence = sentence.ID;
    sentence.responses.push(newResponse.ID);
    this.role.responses.push(newResponse);
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'all', 'response_[ID:'+newResponse.ID+']', '#D5D5FF'));
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
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'all', 'response_[ID:'+removedResponseId+']', '#D5D5FF'));
      }
    });
  }

  addReward(parent: Discussion | Sentence | Response): void {
    parent.rewards.push(new ObjectReward());
    if (parent instanceof Discussion) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_[' + (parent.rewards.length-1) + ']', 'discussion_[ID:'+parent.ID+ ']', '#D5D5FF')); 
    }
    if (parent instanceof Sentence) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_[' + (parent.rewards.length-1) + ']', 'sentence_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
    if (parent instanceof Response) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_[' + (parent.rewards.length-1) + ']', 'response_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
  }

  changeRewardType(parent: Discussion | Sentence | Response, index: number, type: string): void {
    switch (type) {
      case 'quest': parent.rewards[index] = new QuestReward();
        if (parent instanceof Discussion) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[QuestReward]', 'discussion_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Sentence) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[QuestReward]', 'sentence_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Response) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[QuestReward]', 'response_[ID:'+parent.ID+']', '#D5D5FF'));
        }            
        break;
      case 'skill': parent.rewards[index] = new SkillReward();
        if (parent instanceof Discussion) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[SkillReward]', 'discussion_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Sentence) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[SkillReward]', 'sentence_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Response) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[SkillReward]', 'response_[ID:'+parent.ID+']', '#D5D5FF'));
        }            
        break;
      case 'character': parent.rewards[index] = new CharacterReward();
        if (parent instanceof Discussion) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[CharacterReward]', 'discussion_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Sentence) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[CharacterReward]', 'sentence_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Response) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[CharacterReward]', 'response_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        break;
      case 'object': parent.rewards[index] = new ObjectReward();
        if (parent instanceof Discussion) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[DiscussionReward]', 'discussion_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Sentence) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[DiscussionReward]', 'sentence_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Response) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[DiscussionReward]', 'response_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        break;
      case 'discussion': parent.rewards[index] = new DiscussionReward();
        if (parent instanceof Discussion) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[DiscussionReward]', 'discussion_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Sentence) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[DiscussionReward]', 'sentence_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Response) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[DiscussionReward]', 'response_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        break;
      case 'randomObjects': parent.rewards[index] = new RandomObjectsReward();
        if (parent instanceof Discussion) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[RandomObjectsReward]', 'discussion_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Sentence) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[RandomObjectsReward]', 'sentence_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        if (parent instanceof Response) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+index+']_transform_into_[RandomObjectsReward]', 'response_[ID:'+parent.ID+']', '#D5D5FF'));
        }
        break;
    }
  }

  removeReward(parent: Discussion | Sentence | Response, index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_reward_delete') });
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          parent.rewards.splice(index, 1);
          if (parent instanceof Discussion) {
            this.scenario.traces.push(new Trace(this.scenario.traces.length, 'delete', this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_['+index+']', 'discussion_[ID:'+parent.ID+ ']', '#D5D5FF'));
          }
          if (parent instanceof Sentence) {
            this.scenario.traces.push(new Trace(this.scenario.traces.length, 'delete', this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_['+index+']', 'sentence_[ID:'+parent.ID+ ']', '#D5D5FF'));
          }
          if (parent instanceof Response) {
            this.scenario.traces.push(new Trace(this.scenario.traces.length, 'delete', this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_['+index+']', 'reponse_[ID:'+parent.ID+ ']', '#D5D5FF'));
          }
        } else {
          if (parent instanceof Discussion) {
            this.scenario.traces.push(new Trace(this.scenario.traces.length, 'cancel_delete', this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_['+index+']', 'discussion_[ID:'+parent.ID+ ']', '#D5D5FF'));
          }
          if (parent instanceof Sentence) {
            this.scenario.traces.push(new Trace(this.scenario.traces.length, 'cancel_delete', this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_['+index+']', 'sentence_[ID:'+parent.ID+ ']', '#D5D5FF'));
          }
          if (parent instanceof Response) {
            this.scenario.traces.push(new Trace(this.scenario.traces.length, 'cancel_delete', this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, 'Reward_['+index+']', 'reponse_[ID:'+parent.ID+ ']', '#D5D5FF'));
          }
        }
    });
  }

  getQuestReward(parent: Discussion | Sentence | Response, index: number): QuestReward {
    return parent.rewards[index] as QuestReward;
  }

  getCharacterReward(parent: Discussion | Sentence | Response, index: number): CharacterReward {
    return parent.rewards[index] as CharacterReward;
  }

  getSkillReward(parent: Discussion | Sentence | Response, index: number): SkillReward {
    return parent.rewards[index] as SkillReward;
  }

  getObjectReward(parent: Discussion | Sentence | Response, index: number): ObjectReward {
    return parent.rewards[index] as ObjectReward;
  }

  getDiscussionReward(parent: Discussion | Sentence | Response, index: number): DiscussionReward {
    return parent.rewards[index] as DiscussionReward;
  } 
  
  getRandomObjectsReward(parent: Discussion | Sentence | Response, index: number): RandomObjectsReward {
    return parent.rewards[index] as RandomObjectsReward;
  }

  addObjectToRandomObjectsReward(reward: RandomObjectsReward, rewardIndex: number) {
    reward.addObject();
    if (parent instanceof Discussion) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+rewardIndex+']_object_['+(reward.objects.length-1)+']', 'discussion_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
    if (parent instanceof Sentence) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+rewardIndex+']_object_['+(reward.objects.length-1)+']', 'sentence_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
    if (parent instanceof Response) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+rewardIndex+']_object_['+(reward.objects.length-1)+']', 'reponse_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
  }

  removeObjectToRandomObjectsReward(parent: Discussion | Sentence | Response, reward: RandomObjectsReward, rewardIndex: number, objectIndex: number) {
    reward.removeObject(objectIndex);
    if (parent instanceof Discussion) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+rewardIndex+']_object_['+objectIndex+']', 'discussion_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
    if (parent instanceof Sentence) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+rewardIndex+']_object_['+objectIndex+']', 'sentence_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
    if (parent instanceof Response) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'Reward_['+rewardIndex+']_object_['+objectIndex+']', 'reponse_[ID:'+parent.ID+ ']', '#D5D5FF'));
    }
  }

  changeQuestReward(parent: Discussion | Sentence | Response, roleIntitule: string, index: number, event: any) {
    let value: string = event.target.value;
    let reward = new QuestReward();
    reward.intitule = roleIntitule;
    reward.questName = value;
    parent.rewards[index] = reward;
    let target: string = '';
    if (parent instanceof Discussion) {
      target = 'discussion_[ID:'+parent.ID+']';
    }
    if (parent instanceof Sentence) {
      target = 'sentence_[ID:'+parent.ID+']';
    }
    if (parent instanceof Response) {
      target = 'response_[ID:'+parent.ID+']';
    }
    this.editTrace(event, 'Reward_['+index+']_quest', target);
  }

  editTrace(event: any, source: string, target: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex, source, target, '#D5D5FF', undefined, event.target.value));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,source, target, '#D5D5FF'));
    }
  }

  checkboxTrace(event: any, source: string, target: string) {
    if(event.target.checked) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'check', this.pieceDetailsService.missionIndex, this.pieceDetailsService.roleIndex, source, target, '#D5D5FF'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'uncheck', this.pieceDetailsService.missionIndex, this.pieceDetailsService.roleIndex, source, target, '#D5D5FF'));
    }
  }
}

export interface DialogDiscussionData {
  role: Role;
  discussion: Discussion;
  scenario: Scenario;
}
