import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/class/task/task';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {

  @Input() task: Task = new Task('normal');

  constructor(protected tooltipService: TooltipService) { }

  ngOnInit(): void {
  }

}
