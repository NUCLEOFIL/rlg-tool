import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Ressource } from 'src/app/class/ressource/ressource';
import { CharacterReward } from 'src/app/class/rewards/character-reward/character-reward';
import { ObjectiveReward } from 'src/app/class/rewards/objective-reward/objective-reward';
import { ObjectsReward } from 'src/app/class/rewards/objects-reward/objects-reward';
import { OtherReward } from 'src/app/class/rewards/other-reward/other-reward';
import { QuestReward } from 'src/app/class/rewards/quest-reward/quest-reward';
import { Reward } from 'src/app/class/rewards/reward';
import { SkillReward } from 'src/app/class/rewards/skill-reward/skill-reward';
import { RoleEducationnalObjective } from 'src/app/class/role-educationnal-objective/role-educationnal-objective';
import { Role } from 'src/app/class/role/role';
import { SupplementaryRole } from 'src/app/class/supplementary-role/supplementary-role';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  @Input() role: Role = new Role();
  @Input() mission: Mission = new Mission();
  @Input() i: number = 0;

  constructor(protected pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
    this.mission.equalizeLengths();
  }

  displayMenu: string = 'hide';
  rewardType: number = 0;

  onClickDots(): void {
    this.pieceDetailsService.piece = this.role;
  }

  onClickAdd(): void {
    this.mission.roles.push(new Role());
  }

  onClickErase(): void {
    this.role.intitule = '';
    this.role.questName = '';
    this.role.description = '';
    this.role.educationnalObjectives = [new RoleEducationnalObjective()];
    this.role.rewards = [];
    this.role.stuff = '';
    this.role.ressources = [];
    this.role.supplementaryRoles = [];
  }

  onClickDelete(): void {
    this.mission.roles.splice(this.i, 1);
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
    this.role.educationnalObjectives.splice(index, 1);
  }

  addRessource(): void {
    this.role.ressources.push(new Ressource());
  }

  removeRessource(index: number): void {
    this.role.ressources.splice(index, 1);
  }
  
  addSupplementaryRole(): void {
    this.role.supplementaryRoles.push(new SupplementaryRole());
  }

  removeSupplementaryRole(index: number) {
    this.role.supplementaryRoles.splice(index, 1);
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
    this.role.rewards.splice(index, 1);
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
    this.getObjectsReward(i).objects.splice(j, 1);
  }
}
