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
}