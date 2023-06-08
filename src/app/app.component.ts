import { Component } from '@angular/core';
import { Mission } from './class/mission/mission';
import { Scenario } from './class/scenario/scenario';
import { Step } from './class/step/step';
import { Task } from './class/task/task';
import { Role } from './class/role/role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RLG Maker';

  scenario: Scenario;

  constructor() {
    this.scenario = new Scenario();

    this.scenario.missions.forEach(mission => {
      mission.equalizeLengths();   
    });
  }

  test(): void {

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
        const scenario: Scenario = JSON.parse(fileContent) as Scenario;
        this.scenario = scenario;
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