import { Component, Input, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { MatDialog } from '@angular/material/dialog';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Scenario } from 'src/app/class/scenario/scenario';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { Character } from 'src/app/class/character/character';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { MinimapService } from 'src/app/services/minimap/minimap.service';
import { TranslateService } from '@ngx-translate/core';
import { UnityService } from 'src/app/services/unity/unity.service';
import { CharacterReward } from 'src/app/class/rewards/character-reward/character-reward';
import { Reward } from 'src/app/class/rewards/reward';

@Component({
  selector: 'app-game-characters',
  templateUrl: './game-characters.component.html',
  styleUrls: ['./game-characters.component.scss']
})
export class GameCharactersComponent implements OnInit {

  displayMenu: string = 'hide';
  @Input() scenario = new Scenario()
  newCharacter: Character = new Character();

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog, protected pieceDetailsService: PieceDetailsService, private minimapService: MinimapService, protected translate: TranslateService,
    protected unityService: UnityService) { }

  ngOnInit(): void {
  }

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
    this.pieceDetailsService.missionIndex = undefined;
    this.pieceDetailsService.roleIndex = undefined;
    this.pieceDetailsService.pieceIndex = undefined;
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('char_clean') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.newCharacter = new Character();
        this.scenario.characters = [];
        this.scenario.missions.forEach(mission => {
          mission.roles.forEach(role => {
            for (let i = 0; i < role.rewards.length; i++) {
              let reward: Reward = role.rewards[i];
              if (reward.type == 'character') {
                role.rewards.splice(i,1);
                i--;
              }
            }
            role.tasks.forEach(inlineTasks => {
              inlineTasks.forEach(task => {
                if (task instanceof Task) {
                  for (let i = 0; i < task.rewards.length; i++) {
                    let reward = task.rewards[i];
                    if (reward.type == 'character') {
                      task.rewards.splice(i,1);
                      i--;
                    }
                  }    
                  if (task?.typeUnity == 'character' || task?.typeUnity == 'exchangeObjects') {
                    task.character = null;
                  }                                
                }
              });
            });
          });
        });  
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,'all','Characters','#CE7B66'));
        this.minimapService.reset();                 
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',undefined,undefined,'all','Characters','#CE7B66'));                 
      }
    });
  }

  createCharacter(): void {
    if (this.newCharacter.name != '') {
      this.scenario.characters.push(this.newCharacter);
      this.newCharacter = new Character();
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',undefined,undefined,'all','Characters_['+(this.scenario.characters.length-1)+']','#CE7B66'));
      this.minimapService.reset();                    
    }
  }

  deleteCharacter(index: number): void {
      const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('char_delete')+' <'+this.scenario.characters[index].name+'>' });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.scenario.missions.forEach(mission => {
            mission.roles.forEach(role => {
              for (let i = 0; i < role.rewards.length; i++) {
                let reward: Reward = role.rewards[i];
                if (reward.type == 'character') {
                  if ((reward as CharacterReward).character == this.scenario.characters[index]) {
                    role.rewards.splice(i,1);
                    i--;
                  }
                }
              }
              role.tasks.forEach(inlineTask => {
                inlineTask.forEach(task => {
                  if (task instanceof Task) {
                    let i: number | undefined = task?.characters.findIndex(character => character == this.scenario.characters[index]);
                    if (typeof i !== 'undefined' && i !== -1) {
                      task?.characters.splice(i, 1);
                    }
                    for (let rewardIndex = 0; rewardIndex < task.rewards.length; rewardIndex++) {
                      let reward = task.rewards[rewardIndex];
                      if (reward.type == 'character') {
                        if ((reward as CharacterReward).character == this.scenario.characters[index])
                        task.rewards.splice(rewardIndex,1);
                        rewardIndex--;
                      }
                    }    
                    if ((task?.typeUnity == 'character' || task?.typeUnity == 'exchangeObjects') && task.character == this.scenario.characters[index]) {
                      task.character = null;
                    }                    
                  }
                });
              });
            });
          });
          this.scenario.characters.splice(index, 1);
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',undefined,undefined,'all','Characters_['+index+']','#CE7B66'));
          this.minimapService.reset();                
        } else {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',undefined,undefined,'all','Characters_['+index+']','#CE7B66'));                 
        }
      });
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',undefined,undefined,source,'Characters', '#CE7B66'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,source,'Characters', '#CE7B66'));
    }
  }
}
