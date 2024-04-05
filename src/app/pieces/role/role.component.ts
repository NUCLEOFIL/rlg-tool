import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Mission } from 'src/app/class/mission/mission';
import { Ressource } from 'src/app/class/ressource/ressource';
import { CharacterReward } from 'src/app/class/rewards/character-reward/character-reward';
import { ObjectiveReward } from 'src/app/class/rewards/objective-reward/objective-reward';
import { ObjectsReward } from 'src/app/class/rewards/objects-reward/objects-reward';
import { OtherReward } from 'src/app/class/rewards/other-reward/other-reward';
import { QuestReward } from 'src/app/class/rewards/quest-reward/quest-reward';
import { SkillReward } from 'src/app/class/rewards/skill-reward/skill-reward';
import { RoleEducationnalObjective } from 'src/app/class/role-educationnal-objective/role-educationnal-objective';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { SupplementaryRole } from 'src/app/class/supplementary-role/supplementary-role';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { CreateDialogComponent } from 'src/app/components/dialogs/create-dialog/create-dialog.component';
import { Trace } from 'src/app/class/trace/trace';
import { MinimapService } from 'src/app/services/minimap/minimap.service';
import { TranslateService } from '@ngx-translate/core';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleNameDuplicateComponent } from 'src/app/components/snackbars/role-name-duplicate/role-name-duplicate.component';
import { CopyRoleService } from 'src/app/services/copyRole/copy-role.service';
import { Task } from 'src/app/class/task/task';
import { CopyRoleSuccessComponent } from 'src/app/components/snackbars/copy-role-success/copy-role-success.component';
import { RoleOccurrence } from 'src/app/class/role-occurrence/role-occurrence';
import { ObjectReward } from 'src/app/class/rewards/object-reward/object-reward';
import { Reward } from 'src/app/class/rewards/reward';
import { DiscussionReward } from 'src/app/class/rewards/discussion-reward/discussion-reward';
import { UnityService } from 'src/app/services/unity/unity.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() role: Role = new Role();
  @Input() mission: Mission = new Mission();
  @Input() i: number = 0;
  @Input() missionIndex: number = 0;

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog, private minimapService: MinimapService, protected translate: TranslateService, private tutorialService: TutorialService, private _snackBar: MatSnackBar, protected copyRoleService: CopyRoleService,
    protected unityService: UnityService) { }

  ngOnInit(): void {
    this.mission.equalizeLengths();
  }

  displayMenu: string = 'hide';
  rewardType: number = 0;

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.role;
    this.pieceDetailsService.missionIndex = this.missionIndex;
    this.pieceDetailsService.roleIndex = this.i;
    this.pieceDetailsService.pieceIndex = this.i;
  }

  onClickAdd(): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, { data: this.translate.instant('role_new')+' '+(this.missionIndex+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.mission.roles.push(new Role());
        let missionIndex: number = this.scenario.missions.findIndex(mission => mission == this.mission);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',missionIndex,this.i,'all','Role_['+(this.mission.roles.length-1)+']','#9AD5EC'));
      }
    });
  }

  onClickCopy(): void {
    this.copyRoleService.role = Object.assign(new Role(), this.role);
    this.copyRoleService.role.educationnalObjectives = this.role.educationnalObjectives.map((educationnalObjectiveData) => Object.assign(new RoleEducationnalObjective(), educationnalObjectiveData));
    this.copyRoleService.role.ressources = this.role.ressources.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
    this.copyRoleService.role.supplementaryRoles = this.role.supplementaryRoles.map((supplementaryRoleData: any) => Object.assign(new SupplementaryRole(), supplementaryRoleData));
    this.copyRoleService.role.tasks = [[new Task('normal')], []];
    this.copyRoleService.role.chronologie = [];
    this.copyRoleService.role.occurences = this.role.occurences.map((occurenceData: any) => Object.assign(new RoleOccurrence(), occurenceData));
    this.copyRoleService.role.comments = [];
    this.copyRoleService.role.discussions = [];
    this.copyRoleService.role.sentences = [];
    this.copyRoleService.role.responses = [];
    this.copyRoleService.role.rewards = [];
    this.role.rewards.forEach(reward => {
      if (reward.type == 'skill') {
        let newReward: SkillReward = new SkillReward();
        newReward.type = reward.type;
        newReward.quantity = (reward as SkillReward).quantity;
        this.copyRoleService.role?.ressources.forEach(ressource => {
          if (ressource.name == (reward as SkillReward).skill.name && ressource.number == (reward as SkillReward).skill.number && ressource.type == (reward as SkillReward).skill.type) {
            newReward.skill = ressource;
          }
        });
        this.copyRoleService.role?.rewards.push(newReward);
      }
      if (reward.type == 'objective') {
        let newReward: ObjectiveReward = new ObjectiveReward();
        newReward.type = reward.type;
        this.copyRoleService.role?.educationnalObjectives.forEach(objective => {
          if (objective.objective == (reward as ObjectiveReward).objective.objective) {
            newReward.objective = objective;
          }
        });
        this.copyRoleService.role?.rewards.push(newReward);
      }
      if (reward.type == 'character') {
        let newReward: CharacterReward = new CharacterReward();
        newReward.type = reward.type;
        newReward.character = (reward as CharacterReward).character;
        this.copyRoleService.role?.rewards.push(newReward);        
      }
      if (reward.type == 'object') {
        let newReward: ObjectReward = new ObjectReward();
        newReward.type = reward.type;
        newReward.quantity = (reward as ObjectReward).quantity;
        if (this.scenario.ressources.some(ressource => ressource.name == (reward as ObjectReward).object.name && ressource.number == (reward as ObjectReward).object.number && ressource.type == (reward as ObjectReward).object.type)) {
          let i: number = this.scenario.ressources.findIndex(ressource => ressource.name == (reward as ObjectReward).object.name && ressource.number == (reward as ObjectReward).object.number && ressource.type == (reward as ObjectReward).object.type);
          newReward.object = this.scenario.ressources[i];
        } else {
          let i: number = this.role.ressources.findIndex(ressource => ressource.name == (reward as ObjectReward).object.name && ressource.number == (reward as ObjectReward).object.number && ressource.type == (reward as ObjectReward).object.type);
          newReward.object = this.role.ressources[i];
        }
        this.copyRoleService.role?.rewards.push(newReward);
      }
      if (reward.type == 'other') {
        let newReward: OtherReward = new OtherReward();
        newReward.type = reward.type;
        newReward.text = (reward as OtherReward).text;
        this.copyRoleService.role?.rewards.push(newReward);
      }
      if (reward.type == 'objects') {
        let newReward: ObjectsReward = new ObjectsReward();
        newReward.type = reward.type;
        newReward.objects = (reward as ObjectsReward).objects.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
        this.copyRoleService.role?.rewards.push(newReward);
      }
    });
    this.copyRoleService.mission = this.mission;
    this._snackBar.openFromComponent(CopyRoleSuccessComponent, { duration: 5000 });
  }

  onClickPaste(): void {
    //this.role = Object.assign(new Role(), this.copyRoleService.role);
    this.role.intitule = (this.copyRoleService.role as Role).intitule;
    this.role.questName = (this.copyRoleService.role as Role).questName;
    this.role.description = (this.copyRoleService.role as Role).description;
    this.role.stuff = (this.copyRoleService.role as Role).stuff;
    this.role.ressources = (this.copyRoleService.role as Role).ressources.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
    this.role.educationnalObjectives = (this.copyRoleService.role as Role).educationnalObjectives.map((educationnalObjectiveData: any) => Object.assign(new RoleEducationnalObjective(), educationnalObjectiveData));
    this.role.supplementaryRoles = (this.copyRoleService.role as Role).supplementaryRoles.map((supplementaryRoleData: any) => Object.assign(new SupplementaryRole(), supplementaryRoleData));
    this.role.tasks = [[new Task('normal')], []];
    this.role.occurences = (this.copyRoleService.role as Role).occurences.map((occurenceData: any) => Object.assign(new RoleOccurrence(), occurenceData));
    this.role.comments = [];
    this.role.discussions = [];
    this.role.sentences = [];
    this.role.responses = [];
    this.role.rewards = [];
    this.copyRoleService.role?.rewards.forEach(reward => {
      if (reward.type == 'skill') {
        let newReward: SkillReward = new SkillReward();
        newReward.type = reward.type;
        newReward.quantity = (reward as SkillReward).quantity;
        this.role.ressources.forEach(ressource => {
          if (ressource.name == (reward as SkillReward).skill.name && ressource.number == (reward as SkillReward).skill.number && ressource.type == (reward as SkillReward).skill.type) {
            newReward.skill = ressource;
          }
        });
        this.role.rewards.push(newReward);
      }
      if (reward.type == 'objective') {
        let newReward: ObjectiveReward = new ObjectiveReward();
        newReward.type = reward.type;
        this.role?.educationnalObjectives.forEach(objective => {
          if (objective.objective == (reward as ObjectiveReward).objective.objective) {
            newReward.objective = objective;
          }
        });
        this.role.rewards.push(newReward);
      }
      if (reward.type == 'character') {
        let newReward: CharacterReward = new CharacterReward();
        newReward.type = reward.type;
        newReward.character = (reward as CharacterReward).character;
        this.role.rewards.push(newReward);        
      }
      if (reward.type == 'object') {
        let newReward: ObjectReward = new ObjectReward();
        newReward.type = reward.type;
        newReward.quantity = (reward as ObjectReward).quantity;
        if (this.scenario.ressources.some(ressource => ressource.name == (reward as ObjectReward).object.name && ressource.number == (reward as ObjectReward).object.number && ressource.type == (reward as ObjectReward).object.type)) {
          let i: number = this.scenario.ressources.findIndex(ressource => ressource.name == (reward as ObjectReward).object.name && ressource.number == (reward as ObjectReward).object.number && ressource.type == (reward as ObjectReward).object.type);
          newReward.object = this.scenario.ressources[i];
        } else {
          let i: number = this.role.ressources.findIndex(ressource => ressource.name == (reward as ObjectReward).object.name && ressource.number == (reward as ObjectReward).object.number && ressource.type == (reward as ObjectReward).object.type);
          newReward.object = this.role.ressources[i];
        }
        this.role.rewards.push(newReward);
      }
      if (reward.type == 'other') {
        let newReward: OtherReward = new OtherReward();
        newReward.type = reward.type;
        newReward.text = (reward as OtherReward).text;
        this.role.rewards.push(newReward);
      }
      if (reward.type == 'objects') {
        let newReward: ObjectsReward = new ObjectsReward();
        newReward.type = reward.type;
        newReward.objects = (reward as ObjectsReward).objects.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
        this.role.rewards.push(newReward);
      }
    });
    this.intituleIsAlreadyUsed();
    this.minimapService.reset();
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('role_clean')+' '+(this.role.intitule ? '<'+this.role.intitule+'>' : (this.i+1)) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.missions.forEach(mission => {
          mission.roles.forEach(role => {
            if (role.intitule == this.role.intitule) {
              for (let i = 0; i < role.rewards.length; i++) {
                let reward = role.rewards[i];
                if (reward.type == 'quest') {
                  if ((reward as QuestReward).questName == this.role.questName) {
                    role.rewards.splice(i,1);
                    i--;
                  }
                }
              } 
              role.discussions.forEach(discussion => {
                for (let i = 0; i < discussion.rewards.length; i++) {
                  let reward = discussion.rewards[i];
                  if (reward.type == 'quest') {
                    if ((reward as QuestReward).questName == this.role.questName) {
                      discussion.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
              role.sentences.forEach(sentence => {
                for (let i = 0; i < sentence.rewards.length; i++) {
                  let reward = sentence.rewards[i];
                  if (reward.type == 'quest') {
                    if ((reward as QuestReward).questName == this.role.questName) {
                      sentence.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
              role.responses.forEach(response => {
                for (let i = 0; i < response.rewards.length; i++) {
                  let reward = response.rewards[i];
                  if (reward.type == 'quest') {
                    if ((reward as QuestReward).questName == this.role.questName) {
                      response.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
            }
          });
        });
        this.role.intitule = '';
        this.role.questName = '';
        this.role.description = '';
        this.role.educationnalObjectives = [new RoleEducationnalObjective()];
        this.role.rewards = [];
        this.role.stuff = '';
        this.role.supplementaryRoles = []; 
        this.role.discussions = [];
        this.role.sentences = [];
        this.role.responses = [];
        this.role.tasks.forEach(inlineTasks => {
          inlineTasks.forEach(task => {
            this.role.ressources.forEach(ressource => {
              if (task instanceof Task) {
                if (task?.prerequireRessources.some(element => element.ressource == ressource)) {
                  let index: number = task.prerequireRessources.findIndex(element => element.ressource == ressource);
                  task.prerequireRessources.splice(index, 1);
                }
                for (let i = 0; i < task?.rewards.length; i++) {
                  let reward = task.rewards[i];
                  if (reward.type == 'object') {
                    if ((reward as ObjectReward).object == ressource) {
                      task.rewards.splice(i,1);
                      i--;
                    }
                  }
                  if (reward.type == 'skill') {
                    if ((reward as SkillReward).skill == ressource) {
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
        this.role.ressources = [];
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.i,'all','Role_['+(this.i)+']','#9AD5EC'));
        this.minimapService.reset();      
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.missionIndex,this.i,'all','Role_['+(this.i)+']','#9AD5EC'));
      }
    });
  }

  onClickDelete(): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_delete')+' '+(this.role.intitule ? '<'+this.role.intitule+'>' : this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      let missionIndex: number = this.scenario.missions.findIndex(mission => mission == this.mission);
      if (result == true) {
        this.scenario.missions.forEach(mission => {
          mission.roles.forEach(role => {
            if (role.intitule == this.role.intitule) {
              for (let i = 0; i < role.rewards.length; i++) {
                let reward = role.rewards[i];
                if (reward.type == 'quest') {
                  if ((reward as QuestReward).questName == this.role.questName) {
                    role.rewards.splice(i,1);
                    i--;
                  }
                }
              } 
              role.discussions.forEach(discussion => {
                for (let i = 0; i < discussion.rewards.length; i++) {
                  let reward = discussion.rewards[i];
                  if (reward.type == 'quest') {
                    if ((reward as QuestReward).questName == this.role.questName) {
                      discussion.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
              role.sentences.forEach(sentence => {
                for (let i = 0; i < sentence.rewards.length; i++) {
                  let reward = sentence.rewards[i];
                  if (reward.type == 'quest') {
                    if ((reward as QuestReward).questName == this.role.questName) {
                      sentence.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
              role.responses.forEach(response => {
                for (let i = 0; i < response.rewards.length; i++) {
                  let reward = response.rewards[i];
                  if (reward.type == 'quest') {
                    if ((reward as QuestReward).questName == this.role.questName) {
                      response.rewards.splice(i,1);
                      i--;
                    }
                  }
                }
              });
            }
            role.tasks.forEach(inlineTask => {
              inlineTask.forEach(task => {
                if (task instanceof Task) {
                  if (task.typeUnity == 'talkWithRole' || task.typeUnity == 'askToSeeRole') {
                    if (task.role == role.intitule) {
                      task.role = '';
                    }
                  }              
                }
              });
            });
          });
        });
        this.mission.roles.splice(this.i, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',missionIndex,this.i,'all','Role_['+(this.i)+']','#9AD5EC'));
        this.minimapService.reset();  
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',missionIndex,this.i,'all','Role_['+(this.i)+']','#9AD5EC'));
      }
    });
  }

  canDelete(): boolean {
    let res: boolean = true;
    if (this.mission.roles.length <= 2) {
      res = false;
    }
    return res;
  }

  addEducationnalObjective(): void {
    this.role.educationnalObjectives.push(new RoleEducationnalObjective());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.missionIndex,this.i,'Obj_['+(this.role.educationnalObjectives.length-1)+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
    this.minimapService.reset();
  }

  removeEducationnalObjective(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_objective_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.educationnalObjectives.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.i,'Obj_['+(index)+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
        this.minimapService.reset();
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.missionIndex,this.i,'Obj_['+(index)+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
      }
    });
  }

  addRessource(): void {
    this.role.ressources.push(new Ressource());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.missionIndex,this.i,'skill/ressource_['+this.role.ressources.length+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
    this.minimapService.reset();
  }

  removeRessource(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_ressource_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        for (let i = 0; i < this.role.rewards.length; i++) {
          let reward: Reward = this.role.rewards[i];
          if (reward.type == 'object') {
            if (this.role.ressources[index] == (reward as ObjectReward).object) {
              this.role.rewards.splice(i,1);
              i--;
            }
          }
          if (reward.type == 'skill') {
            if (this.role.ressources[index] == (reward as SkillReward).skill) {
              this.role.rewards.splice(i,1);
              i--;
            }
          }
        }
        this.role.discussions.forEach(discussion => {
          for (let i = 0; i < discussion.rewards.length; i++) {
            let reward: Reward = discussion.rewards[i];
            if (reward.type == 'object') {
              if (this.role.ressources[index] == (reward as ObjectReward).object) {
                discussion.rewards.splice(i,1);
                i--;
              }
            }
            if (reward.type == 'skill') {
              if (this.role.ressources[index] == (reward as SkillReward).skill) {
                discussion.rewards.splice(i,1);
                i--;
              }
            }
          }
        });
        this.role.sentences.forEach(sentence => {
          for (let i = 0; i < sentence.rewards.length; i++) {
            let reward: Reward = sentence.rewards[i];
            if (reward.type == 'object') {
              if (this.role.ressources[index] == (reward as ObjectReward).object) {
                sentence.rewards.splice(i,1);
                i--;
              }
            }
            if (reward.type == 'skill') {
              if (this.role.ressources[index] == (reward as SkillReward).skill) {
                sentence.rewards.splice(i,1);
                i--;
              }
            }
          }
        });
        this.role.responses.forEach(response => {
          for (let i = 0; i < response.rewards.length; i++) {
            let reward: Reward = response.rewards[i];
            if (reward.type == 'object') {
              if (this.role.ressources[index] == (reward as ObjectReward).object) {
                response.rewards.splice(i,1);
                i--;
              }
            }
            if (reward.type == 'skill') {
              if (this.role.ressources[index] == (reward as SkillReward).skill) {
                response.rewards.splice(i,1);
                i--;
              }
            }
          }
        });
        this.role.tasks.forEach(inlineTasks => {
          inlineTasks.forEach(task => {
            if (task instanceof Task) {
              task?.prerequireRessources.forEach((prerequire, j) => {
                if (prerequire.ressource == this.role.ressources[index]) {
                  task.prerequireRessources.splice(j, 1);
                }
              });
              for (let i = 0; i < task?.rewards.length; i++) {
                let reward = task.rewards[i];
                if (reward.type == 'object') {
                  if ((reward as ObjectReward).object == this.role.ressources[index]) {
                    task.rewards.splice(i,1);
                    i--;
                  }
                }
                if (reward.type == 'skill') {
                  if ((reward as SkillReward).skill == this.role.ressources[index]) {
                    task.rewards.splice(i,1);
                    i--;
                  }
                }
              }
              if (task?.typeUnity == 'getObject' || task?.typeUnity == 'combineObjects' || task?.typeUnity == 'exchangeObjects' || task?.typeUnity == 'depositObject' || task?.typeUnity == 'interactObject') {
                if (task.object == this.role.ressources[index]) {
                  task.object = null;
                }
                task.combineObjects.forEach((object, i) => {
                  if (object[0] == this.role.ressources[index]) {
                    task.combineObjects[i][0] = null;
                  }
                });
                task.giveObjects.forEach((object, i) => {
                  if (object[0] == this.role.ressources[index]) {
                    task.giveObjects[i][0] = null;
                  }
                });
                task.receiveObjects.forEach((object, i) => {
                  if (object[0] == this.role.ressources[index]) {
                    task.receiveObjects[i][0] = null;
                  }
                });
              }    
            }       
          });
        });
        this.role.ressources.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.i,'Skill/Ressource_['+index+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
        this.minimapService.reset();       
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.missionIndex,this.i,'Skill/Ressource_['+index+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
      }
    });
  }
  
  addSupplementaryRole(): void {
    this.role.supplementaryRoles.push(new SupplementaryRole());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.missionIndex,this.i,'Secondary_role_['+(this.role.supplementaryRoles.length-1)+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
    this.minimapService.reset();
  }

  removeSupplementaryRole(index: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_supplementaryRole_delete')+(this.role.supplementaryRoles[index].name ? ' <'+this.role.supplementaryRoles[index].name+'>' : '') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.supplementaryRoles.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.i,'Secondary_role_['+index+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
        this.minimapService.reset();
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.missionIndex,this.i,'Secondary_role_['+index+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
      }
    });
  }

  addReward(): void {
    this.role.rewards.push(new QuestReward());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.missionIndex,this.i,'Reward_['+this.role.rewards.length+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
    this.minimapService.reset();
    this.validTutorialPhase5();
  }

  changeRewardType(index: number, type: string): void {
    switch(type) {
      case 'objects': this.role.rewards[index] = new ObjectsReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[ObjectsReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
      case 'quest': this.role.rewards[index] = new QuestReward(); 
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[QuestReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
      case 'skill': this.role.rewards[index] = new SkillReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[SkillReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
      case 'objective': this.role.rewards[index] = new ObjectiveReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[ObjectiveReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
      case 'character': this.role.rewards[index] = new CharacterReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[CharacterReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
      case 'other': this.role.rewards[index] = new OtherReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[OtherReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
      case 'object': this.role.rewards[index] = new ObjectReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[ObjectReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
      case 'discussion': this.role.rewards[index] = new DiscussionReward();
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[DiscussionReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
        break;
    }
  }

  removeReward(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_reward_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.rewards.splice(index, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.i,'Reward_['+index+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
        this.minimapService.reset();      
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.missionIndex,this.i,'Reward_['+index+']', 'Role_['+this.i+']', '#9AD5EC', '*'));        
      }
    });
  }

  getObjectiveReward(index: number): ObjectiveReward {
    return this.role.rewards[index] as ObjectiveReward;
  }

  getQuestReward(index: number): QuestReward {
    return this.role.rewards[index] as QuestReward;
  }

  getCharacterReward(index: number): CharacterReward {
    return this.role.rewards[index] as CharacterReward;
  }

  getSkillReward(index: number): SkillReward {
    return this.role.rewards[index] as SkillReward;
  }

  getObjectReward(index: number): ObjectReward {
    return this.role.rewards[index] as ObjectReward;
  }

  getOtherReward(index: number): OtherReward {
    return this.role.rewards[index] as OtherReward;
  }

  getObjectsReward(index: number): ObjectsReward {
    return this.role.rewards[index] as ObjectsReward;
  }

  getDiscussionReward(index: number): DiscussionReward {
    return this.role.rewards[index] as DiscussionReward;
  }

  addObject(index: number): void {
    this.getObjectsReward(index).objects.push(new Ressource);
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.missionIndex,this.i,'Reward_['+index+']_object_['+this.getObjectsReward(index).objects.length+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
    this.minimapService.reset();
  }

  removeObject(i: number, j: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_reward_type_object_delete') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getObjectsReward(i).objects.splice(j, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,this.i,'Reward_['+i+']_object_['+j+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
        this.minimapService.reset();
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.missionIndex,this.i,'Reward_['+i+']_object_['+j+']', 'Role_['+this.i+']', '#9AD5EC', '*'));
      }
    });
  }

  changeQuestReward(index: number, event: any) {
    let value: string = event.target.value;
    let reward = new QuestReward();
    reward.intitule = this.role.intitule;
    reward.questName = value;
    this.role.rewards[index] = reward;
    this.editTrace(event, 'Reward_['+index+']_quest');
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.missionIndex,this.i,source,'Role_['+(this.i)+']', '#9AD5EC','*'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.i,source,'Role_['+(this.i)+']', '#9AD5EC','*'));
    }
  }

  validTutorialPhase4(): void {
    if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 4
      && this.scenario.missions[0].roles[0].intitule && this.scenario.missions[0].roles[1].intitule) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
      this.tutorialService.validPhase();
    }
  }

  validTutorialPhase5(): void {
    if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 5
      && this.scenario.missions[0].roles[0].questName && this.scenario.missions[0].roles[0].rewards.length > 0
      && this.scenario.missions[0].roles[1].questName && this.scenario.missions[0].roles[1].rewards.length > 0) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
      this.tutorialService.validPhase();
    }
  }

  intituleIsAlreadyUsed(): void {
    this.mission.roles.forEach(role => {
      if (role != this.role && role.intitule == this.role.intitule) {
        this._snackBar.openFromComponent(RoleNameDuplicateComponent, { duration: 5000 });
        this.role.intitule = '';
      }
    });
  }
}
