import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {

  @Input() task: Task = new Task('normal');

  constructor() { }

  ngOnInit(): void {
  }

}
