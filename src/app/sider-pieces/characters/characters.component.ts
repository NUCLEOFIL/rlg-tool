import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/class/character/character';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() task: Task = new Task('normal');
  newCharacter: Character = new Character();
  selectedAssignCharacter!: Character | undefined;
  selectedDeleteCharacterIndex!: number;

  constructor() { }

  ngOnInit(): void {
  }

  createCharacter(): void {
    if (this.newCharacter.name != '') {
      this.scenario.characters.push(this.newCharacter);
      this.newCharacter = new Character();
    }
  }

  deleteCharacter(): void {
    if (this.selectedDeleteCharacterIndex != undefined) {
      this.scenario.missions.forEach(mission => {
        mission.roles.forEach(role => {
          role.tasks.forEach(inlineTask => {
            inlineTask.forEach(task => {
              let index: number | undefined = task?.characters.findIndex(character => character == this.scenario.characters[this.selectedDeleteCharacterIndex]);
              if (typeof index !== 'undefined' && index !== -1) {
                task?.characters.splice(index, 1);
              }
            });
          });
        });
      });
      this.scenario.characters.splice(this.selectedDeleteCharacterIndex, 1);
    }
  }

  assignCharacter(): void {
    if (this.selectedAssignCharacter != undefined) {
      this.task.characters.push(this.selectedAssignCharacter);
      this.selectedAssignCharacter = undefined;
    }
  }

  notAlreadyAssigned(character: Character): boolean {
    return !this.task.characters.includes(character);
  }
}
