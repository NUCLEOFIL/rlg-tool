import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repeat-task',
  templateUrl: './repeat-task.component.html',
  styleUrls: ['./repeat-task.component.scss']
})
export class RepeatTaskComponent implements OnInit {

  displayMenu: string = 'hide';

  constructor() { }

  ngOnInit(): void {
  }

  onClickErase(): void {
    
  } 

  onClickDots(): void {
    
  }

  onClickDelete(): void {
    
  }
}
