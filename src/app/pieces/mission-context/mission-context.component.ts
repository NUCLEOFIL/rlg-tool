import { Component, Input, OnInit } from '@angular/core';
import { MissionContext } from 'src/app/class/mission-context/mission-context';

@Component({
  selector: 'app-mission-context',
  templateUrl: './mission-context.component.html',
  styleUrls: ['./mission-context.component.scss']
})
export class MissionContextComponent implements OnInit {

  constructor() { }

  @Input() missionContext: MissionContext = new MissionContext();

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickDots(): void {
    
  }

  onClickAdd(): void {
    
  }

  onClickErase(): void {
    
  } 

}
