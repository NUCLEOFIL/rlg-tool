import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-interupt',
  templateUrl: './interupt.component.html',
  styleUrls: ['./interupt.component.scss']
})
export class InteruptComponent implements OnInit {

  @Input() task: Task = new Task('normal');

  constructor() { }

  ngOnInit(): void {
  }

}
