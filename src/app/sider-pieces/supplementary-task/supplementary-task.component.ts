import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-supplementary-task',
  templateUrl: './supplementary-task.component.html',
  styleUrls: ['./supplementary-task.component.scss']
})
export class SupplementaryTaskComponent implements OnInit {

  @Input() task: Task = new Task('normal');

  constructor() { }

  ngOnInit(): void {
  }

  checkbox: boolean = false;

}
