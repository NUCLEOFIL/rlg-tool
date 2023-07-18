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

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.mission.equalizeLengths();
  }

  displayMenu: string = 'hide';
  rewardType: number = 0;

  onClickDots(): void {
    this.pieceDetailsService.piece = this.role;
  }

  onClickAdd(): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, { data: 'un nouveau Rôle pour la Mission '+(this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.mission.roles.push(new Role());        
      }
    });
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Role '+(this.role.intitule ? '<'+this.role.intitule+'>' : (this.i+1)) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.intitule = '';
        this.role.questName = '';
        this.role.description = '';
        this.role.educationnalObjectives = [new RoleEducationnalObjective()];
        this.role.rewards = [];
        this.role.stuff = '';
        this.role.ressources = [];
        this.role.supplementaryRoles = [];         
      }
    });
  }

  onClickDelete(): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'ce Rôle '+(this.role.intitule ? '<'+this.role.intitule+'>' : this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.mission.roles.splice(this.i, 1);       
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
  }

  removeEducationnalObjective(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Objectif Pédagogique' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.educationnalObjectives.splice(index, 1);
      }
    });
  }

  addRessource(): void {
    this.role.ressources.push(new Ressource());
  }

  removeRessource(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Ressource' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.tasks.forEach(inlineTasks => {
          inlineTasks.forEach(task => {
            task?.prerequireRessources.forEach((prerequire, j) => {
              if (prerequire.ressource == this.role.ressources[index]) {
                task.prerequireRessources.splice(j, 1);
              }
            });
          });
        });
        this.role.ressources.splice(index, 1);        
      }
    });
  }
  
  addSupplementaryRole(): void {
    this.role.supplementaryRoles.push(new SupplementaryRole());
  }

  removeSupplementaryRole(index: number) {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'ce Rôle Supplémentaire'+(this.role.supplementaryRoles[index].name ? ' <'+this.role.supplementaryRoles[index].name+'>' : '') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.supplementaryRoles.splice(index, 1);
      }
    });
  }

  addReward(): void {
    this.role.rewards.push(new QuestReward());
  }

  changeRewardType(index: number, type: string): void {
    switch(type) {
      case 'objects': this.role.rewards[index] = new ObjectsReward(); break;
      case 'quest': this.role.rewards[index] = new QuestReward(); break;
      case 'skill': this.role.rewards[index] = new SkillReward(); break;
      case 'objective': this.role.rewards[index] = new ObjectiveReward(); break;
      case 'character': this.role.rewards[index] = new CharacterReward(); break;
      case 'other': this.role.rewards[index] = new OtherReward(); break;
    }
  }

  removeReward(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Récompense' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.role.rewards.splice(index, 1);        
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

  getOtherReward(index: number): OtherReward {
    return this.role.rewards[index] as OtherReward;
  }

  getObjectsReward(index: number): ObjectsReward {
    return this.role.rewards[index] as ObjectsReward;
  }

  addObject(index: number): void {
    this.getObjectsReward(index).objects.push(new Ressource);
  }

  removeObject(i: number, j: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cet Objet de la Récompense' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getObjectsReward(i).objects.splice(j, 1);
      }
    });
  }

  changeQuestReward(index: number, event: any) {
    let value: string = event.target.value;
    let reward = new QuestReward();
    reward.intitule = this.role.intitule;
    reward.questName = value;
    this.role.rewards[index] = reward;
  }
}
