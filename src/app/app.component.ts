import { Component } from '@angular/core';
import { Scenario } from './class/scenario/scenario';

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
  }

  test() {
    console.log(this.scenario);
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
  
  onFileSelected(event: any) {
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
}