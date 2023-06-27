import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/class/character/character';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

  @Input() task: Task = new Task('normal');
  @Input() character: Character = new Character();
  @Input() index: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  unassignCharacter(index: number): void {
    this.task.characters.splice(index, 1);
  }

}
