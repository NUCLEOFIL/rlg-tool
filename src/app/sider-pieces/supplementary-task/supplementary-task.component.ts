import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/class/task/task';
import { Role } from 'src/app/class/role/role';

@Component({
  selector: 'app-supplementary-task',
  templateUrl: './supplementary-task.component.html',
  styleUrls: ['./supplementary-task.component.scss']
})
export class SupplementaryTaskComponent implements OnInit {

  @Input() task: Task = new Task('normal');
  @Input() role: Role = new Role();

  constructor() { }

  ngOnInit(): void {
  }
}
