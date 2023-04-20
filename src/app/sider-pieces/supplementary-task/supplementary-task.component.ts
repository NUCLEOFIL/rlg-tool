import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplementary-task',
  templateUrl: './supplementary-task.component.html',
  styleUrls: ['./supplementary-task.component.scss']
})
export class SupplementaryTaskComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  checkbox: boolean = false;

}
