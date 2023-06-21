import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {

  @Input() task: Task = new Task('normal');

  constructor() { }

  ngOnInit(): void {
  }

}
