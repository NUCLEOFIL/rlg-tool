import { Component, Input, OnInit } from '@angular/core';
import { MissionContext } from 'src/app/class/mission-context/mission-context';
import { Mission } from 'src/app/class/mission/mission';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';

@Component({
  selector: 'app-mission-context',
  templateUrl: './mission-context.component.html',
  styleUrls: ['./mission-context.component.scss']
})
export class MissionContextComponent implements OnInit {

  constructor(private pieceDetailsService: PieceDetailsService) { }

  @Input() missionContext: MissionContext = new MissionContext();
  @Input() scenario: Scenario = new Scenario();
  @Input() i: number = 0;

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickDots(): void {
    this.pieceDetailsService.piece = this.scenario.missions[this.i];
  }

  onClickAdd(): void {
    this.scenario.missions.push(new Mission());
  }

  onClickErase(): void {
    this.missionContext.duration = '';
    this.missionContext.intrigue = '';
    this.missionContext.communication = '';
    this.missionContext.various = '';
  } 

  onClickDelete(): void {
    this.scenario.missions.splice(this.i, 1);
  }

  canDelete(): boolean {
    let res: boolean = true;
    if (this.scenario.missions.length <= 1) {
      res = false;
    }
    return res;
  }

}
