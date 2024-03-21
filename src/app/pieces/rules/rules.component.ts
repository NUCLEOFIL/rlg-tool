import { Component, Input, OnInit } from '@angular/core';
import { Ressource } from 'src/app/class/ressource/ressource';
import { Scenario } from 'src/app/class/scenario/scenario';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { MatDialog } from '@angular/material/dialog';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { MinimapService } from 'src/app/services/minimap/minimap.service';
import { TranslateService } from '@ngx-translate/core';
import { ObjectReward } from 'src/app/class/rewards/object-reward/object-reward';
import { Reward } from 'src/app/class/rewards/reward';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  displayMenu: string = 'hide';
  @Input() scenario: Scenario = new Scenario();

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog, protected pieceDetailsService: PieceDetailsService, private minimapService: MinimapService, protected translate: TranslateService) { }

  ngOnInit(): void {
  }

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
    this.pieceDetailsService.missionIndex = undefined;
    this.pieceDetailsService.roleIndex = undefined;
    this.pieceDetailsService.pieceIndex = undefined;
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('rules_clean') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.gameRules = '';
        this.scenario.ressources.forEach((ressource) => {
          this.scenario.missions.forEach(mission => {
            mission.roles.forEach(role => {
              for (let i = 0; i < role.rewards.length; i++) {
                let reward: Reward = role.rewards[i];
                if (reward.type == 'object') {
                  if (ressource == (reward as ObjectReward).object) {
                    role.rewards.splice(i,1);
                    i--;
                  }
                }
              }
              role.discussions.forEach(discussion => {
                for (let i = 0; i < discussion.rewards.length; i++) {
                  let reward: Reward = discussion.rewards[i];
                  if (reward.type == 'object') {
                    if (ressource == (reward as ObjectReward).object) {
                      discussion.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
              role.sentences.forEach(sentence => {
                for (let i = 0; i < sentence.rewards.length; i++) {
                  let reward: Reward = sentence.rewards[i];
                  if (reward.type == 'object') {
                    if (ressource == (reward as ObjectReward).object) {
                      sentence.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
              role.responses.forEach(response => {
                for (let i = 0; i < response.rewards.length; i++) {
                  let reward: Reward = response.rewards[i];
                  if (reward.type == 'object') {
                    if (ressource == (reward as ObjectReward).object) {
                      response.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
              role.tasks.forEach(inlineTasks => {
                inlineTasks.forEach(task => {
                  if (task instanceof Task) {
                    task.prerequireRessources.forEach((taskRessource, j) => {
                      if (ressource == taskRessource.ressource) {
                        task.prerequireRessources.splice(j, 1);
                      }
                    });
                    for (let i = 0; i < task.rewards.length; i++) {
                      let reward = task.rewards[i];
                      if (reward.type == 'object') {
                        if ((reward as ObjectReward).object == ressource) {
                          task.rewards.splice(i,1);
                          i--;                        
                        }
                      }
                    }
                    if (task?.typeUnity == 'getObject' || task?.typeUnity == 'combineObjects' || task?.typeUnity == 'exchangeObjects' || task?.typeUnity == 'depositObject' || task?.typeUnity == 'interactObject') {
                      if (task.object == ressource) {
                        task.object = null;
                      }
                      task.combineObjects.forEach((object, i) => {
                        if (object[0] == ressource) {
                          task.combineObjects[i][0] = null;
                        }
                      });
                      task.giveObjects.forEach((object, i) => {
                        if (object[0] == ressource) {
                          task.giveObjects[i][0] = null;
                        }
                      });
                      task.receiveObjects.forEach((object, i) => {
                        if (object[0] == ressource) {
                          task.receiveObjects[i][0] = null;
                        }
                      });
                    }
                  }
                });
              });
            });
          });
        });
        this.scenario.ressources = [];
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,'all','Rules', '#C6C2BD'));
        this.minimapService.reset();
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',undefined,undefined,'all','Rules', '#C6C2BD'));
      }
    });
  }

  addRessource(): void {
    this.scenario.ressources.push(new Ressource());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',undefined,undefined,'Ressource_['+(this.scenario.traces.length-1)+']','Rules', '#C6C2BD'));
    this.minimapService.reset();
  }

  removeRessource(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('rules_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.missions.forEach(mission => {
          mission.roles.forEach(role => {
            for (let i = 0; i < role.rewards.length; i++) {
              let reward: Reward = role.rewards[i];
              if (reward.type == 'object') {
                if (this.scenario.ressources[index] == (reward as ObjectReward).object) {
                  role.rewards.splice(i,1);
                  i--;
                }
              }
            }
            role.discussions.forEach(discussion => {
              for (let i = 0; i < discussion.rewards.length; i++) {
                let reward: Reward = discussion.rewards[i];
                if (reward.type == 'object') {
                  if (this.scenario.ressources[index] == (reward as ObjectReward).object) {
                    discussion.rewards.splice(i,1);
                    i--;
                  }
                }
              }             
            });
            role.sentences.forEach(sentence => {
              for (let i = 0; i < sentence.rewards.length; i++) {
                let reward: Reward = sentence.rewards[i];
                if (reward.type == 'object') {
                  if (this.scenario.ressources[index] == (reward as ObjectReward).object) {
                    sentence.rewards.splice(i,1);
                    i--;
                  }
                }
              }             
            });
            role.responses.forEach(response => {
              for (let i = 0; i < response.rewards.length; i++) {
                let reward: Reward = response.rewards[i];
                if (reward.type == 'object') {
                  if (this.scenario.ressources[index] == (reward as ObjectReward).object) {
                    response.rewards.splice(i,1);
                    i--;
                  }
                }
              }             
            });
            role.tasks.forEach(inlineTasks => {
              inlineTasks.forEach(task => {
                if (task instanceof Task) {
                  task?.prerequireRessources.forEach((prerequire, j) => {
                    if (this.scenario.ressources[index] == prerequire.ressource) {
                      task.prerequireRessources.splice(j, 1);
                    }
                  });
                  for (let i = 0; i < task.rewards.length; i++) {
                    let reward = task.rewards[i];
                    if (reward.type == 'object') {
                      if ((reward as ObjectReward).object == this.scenario.ressources[index]) {
                        task.rewards.splice(i,1);
                        i--;                        
                      }
                    }
                  }    
                  if (task?.typeUnity == 'getObject' || task?.typeUnity == 'combineObjects' || task?.typeUnity == 'exchangeObjects' || task?.typeUnity == 'depositObject' || task?.typeUnity == 'interactObject') {
                    if (task.object == this.scenario.ressources[index]) {
                      task.object = null;
                    }
                    task.combineObjects.forEach((object, i) => {
                      if (object[0] == this.scenario.ressources[index]) {
                        task.combineObjects[i][0] = null;
                      }
                    });
                    task.giveObjects.forEach((object, i) => {
                      if (object[0] == this.scenario.ressources[index]) {
                        task.giveObjects[i][0] = null;
                      }
                    });
                    task.receiveObjects.forEach((object, i) => {
                      if (object[0] == this.scenario.ressources[index]) {
                        task.receiveObjects[i][0] = null;
                      }
                    });
                  }
                }      
              });
            });
          });
        });
        this.scenario.ressources.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',undefined,undefined,'Ressource_['+index+']','Rules', '#C6C2BD'));
        this.minimapService.reset();
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',undefined,undefined,'Ressource_['+index+']','Rules', '#C6C2BD'));
      }
    });
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',undefined,undefined,source,'Rules', '#C6C2BD'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,source,'Rules', '#C6C2BD'));
    }
  }
}
