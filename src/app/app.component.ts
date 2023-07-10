import { ChangeDetectorRef, Component } from '@angular/core';
import { Mission } from './class/mission/mission';
import { Scenario } from './class/scenario/scenario';
import { Step } from './class/step/step';
import { Task } from './class/task/task';
import { Role } from './class/role/role';
import { GameContext } from './class/game-context/game-context';
import { GameEducationnalObjective } from './class/game-educationnal-objective/game-educationnal-objective';
import { Character } from './class/character/character';
import { Ressource } from './class/ressource/ressource';
import { MissionContext } from './class/mission-context/mission-context';
import { EducationnalObjective } from './class/educationnal-objective/educationnal-objective';
import { RoleOccurrence } from './class/role-occurrence/role-occurrence';
import { SupplementaryRole } from './class/supplementary-role/supplementary-role';
import { Symbol } from './class/symbol/symbol';
import { PieceDetailsService } from './services/piece-details/piece-details.service';
import { Comment } from './class/comment/comment';
import { Reward } from './class/rewards/reward';
import { SkillReward } from './class/rewards/skill-reward/skill-reward';
import { CharacterReward } from './class/rewards/character-reward/character-reward';
import { QuestReward } from './class/rewards/quest-reward/quest-reward';
import { ObjectsReward } from './class/rewards/objects-reward/objects-reward';
import { ObjectiveReward } from './class/rewards/objective-reward/objective-reward';
import { OtherReward } from './class/rewards/other-reward/other-reward';
import { PrerequireRessource } from './class/prerequires/prerequire-ressource/prerequire-ressource';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RLG Maker';

  scenario: Scenario = new Scenario();

  constructor(private cdr: ChangeDetectorRef, protected pieceDetailsService: PieceDetailsService) {
    pieceDetailsService.piece = this.scenario;

    this.scenario.missions.forEach(mission => {
      mission.equalizeLengths();
    });
  }

  downloadFile(): void {
    const jsonString = JSON.stringify(this.scenario);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'scenario.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const fileContent: string = reader.result as string;
        const jsonData: any = JSON.parse(fileContent);
        const scenario: Scenario = Object.assign(new Scenario(), jsonData);
        scenario.context = Object.assign(new GameContext(), jsonData.context);
        scenario.context.comments = jsonData.context.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
        scenario.educationnalObjective = Object.assign(new GameEducationnalObjective(), jsonData.educationnalObjective);
        scenario.educationnalObjective.comments = jsonData.educationnalObjective.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
        scenario.gameRules = jsonData.gameRules;
        scenario.characters = jsonData.characters.map((characterData: any) => Object.assign(new Character(), characterData));
        scenario.ressources = jsonData.ressources.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
        scenario.comments = jsonData.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
        scenario.missions = jsonData.missions.map((missionData: any) => Object.assign(new Mission(), missionData));
        scenario.missions.forEach((mission, index)=> {
          mission.chronologie = jsonData.missions[index].chronologie.map((chronologieData: any) => {
            if (chronologieData !== null) {
              return Object.assign(new Step(), chronologieData);
            } else {
              return null;
            }
          });
          mission.chronologie.forEach((step) => {
            if (step instanceof Step) {
              step.comments = step.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
            }
          });
          mission.comments = jsonData.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
          mission.context = Object.assign(new MissionContext(), jsonData.missions[index].context);
          mission.context.comments = jsonData.missions[index].context.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
          mission.educationnalObjective = Object.assign(new EducationnalObjective(), jsonData.missions[index].educationnalObjective);
          mission.educationnalObjective.comments = jsonData.missions[index].educationnalObjective.comments.map((commentData: any) => Object.assign(new Comment, commentData));
          mission.roles = jsonData.missions[index].roles.map((roleData: any) => Object.assign(new Role(), roleData));
          mission.roles.forEach((role, index) => {
            role.comments = role.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
            role.chronologie = mission.roles[index].chronologie.map((chronologieData: any) => {
              if (chronologieData !== null) {
                return Object.assign(new Step(), chronologieData);
              } else {
                return null;
              }
            });
            role.chronologie.forEach((step) => {
              if (step instanceof Step) {
                step.comments = step.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
              }
            });
            role.ressources = role.ressources.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
            role.occurences = role.occurences.map((occurrenceData: any) => Object.assign(new RoleOccurrence(), occurrenceData));
            role.supplementaryRoles = role.supplementaryRoles.map((supplementaryRoleData: any) => Object.assign(new SupplementaryRole(), supplementaryRoleData));
            role.rewards = role.rewards.map((rewardData: any) => {
              if (rewardData.type == 'skill') {
                return Object.assign(new SkillReward(), rewardData);
              }
              if (rewardData.type == 'character') {
                return Object.assign(new CharacterReward(), rewardData);
              }
              if (rewardData.type == 'quest') {
                return Object.assign(new QuestReward(), rewardData);
              }
              if (rewardData.type == 'objects') {
                return Object.assign(new ObjectsReward(), rewardData);
              }
              if (rewardData.type == 'objective') {
                return Object.assign(new ObjectiveReward(), rewardData);
              }
              if (rewardData.type == 'other') {
                return Object.assign(new OtherReward(), rewardData);
              }
            });
            role.rewards.forEach((reward: Reward, index: number) => {
              if (reward instanceof SkillReward) {
                let i: number = role.ressources.findIndex(element => element.type == 'attribut' && element.name == reward.skill.name && element.number == reward.skill.number);
                reward.skill = role.ressources[i];
              }
              if (reward instanceof CharacterReward) {
                let i: number = scenario.characters.findIndex(element => element.color == reward.character.color && element.description == reward.character.description && element.name == reward.character.name);
                reward.character = scenario.characters[i];
              }
              if (reward instanceof ObjectiveReward) {
                let i: number = role.educationnalObjectives.findIndex(element => element.objective == reward.objective.objective);
                reward.objective = role.educationnalObjectives[i];
              }
              
            });
            role.tasks.forEach((inlineTasks: any[], index: number) => {
              role.tasks[index] = inlineTasks.map((taskData: any) => {
                if (taskData !== null) {
                  return Object.assign(new Task(taskData.type), taskData);
                } else {
                  return null;
                }
              });
              role.tasks[index].forEach(task => {
                if (task instanceof Task) {
                  task.comments = task.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                  task.symbol = Object.assign(new Symbol(), task.symbol);
                  task.characters = task.characters.map((characterData: any) => Object.assign(new Character(), characterData));
                  task.characters.forEach((character, index) => {
                    let i: number | undefined = scenario.characters.findIndex(element => element.name == character.name && element.description == character.description && element.color == character.color);
                    if (typeof i !== 'undefined' && i !== -1) {
                      task.characters[i] = scenario.characters[index];
                    }
                  });
                  let supplementaryRoleIndex: number | undefined = role.supplementaryRoles.findIndex(element =>
                    element.name == task.supplementaryRole.name 
                    && element.color == task.supplementaryRole.color
                  );
                  task.supplementaryRole = role.supplementaryRoles[supplementaryRoleIndex];
                  task.prerequireRessources = task.prerequireRessources.map((prerequireData: any) => Object.assign(new PrerequireRessource(), prerequireData));
                  task.prerequireRessources.forEach((prerequire, index) => {
                      if (scenario.ressources.some(element => element.name == prerequire.ressource.name && element.number == prerequire.ressource.number)) {
                        let i: number = scenario.ressources.findIndex(element => element.name == prerequire.ressource.name && element.number == prerequire.ressource.number);
                        prerequire.ressource = scenario.ressources[i];
                      } else {
                        let i: number = role.ressources.findIndex(element => element.name == prerequire.ressource.name && element.number == prerequire.ressource.number);
                        prerequire.ressource = role.ressources[i];
                      }
                  })
                }
              });
            });
          });
        });
        this.scenario = scenario;
        this.pieceDetailsService.piece = this.scenario;
        this.cdr.detectChanges();
      };
    }
  }

  addMissionStep(mission: Mission, index: number): void {
    mission.addChronologieStep(index);
    mission.equalizeLengths();
  }

  addRoleStep(mission: Mission, role: Role, index: number): void {
    role.addChronologieStep(index);
    mission.equalizeLengths();
  }

  addTask(mission: Mission, role: Role, i: number, j: number, type: string) {
    role.addTask(i, j, type);
    mission.equalizeLengths();
  }

  dontContainFinalOrRepeatTask(tasks: (Task|null)[]): boolean {
    return !(tasks.some(task => task?.type == 'final') || tasks.some(task => task?.type == 'repeat'));
  }

  dontHaveTaskAfter(tasks: (Task|null)[], index: number): boolean {
    return !tasks.slice(index, tasks.length).some(task => task instanceof Task);
  }

  canCreateFinalOrRepeatTask(tasks: (Task|null)[], index: number): boolean {
    let res: boolean = false;
    if (this.dontContainFinalOrRepeatTask(tasks) && this.dontHaveTaskAfter(tasks, index)) {
      res = true;
    }
    return res;
  }
}