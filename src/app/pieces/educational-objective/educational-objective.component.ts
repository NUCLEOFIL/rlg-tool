import { Component, Input, OnInit } from '@angular/core';
import { EducationnalObjective } from 'src/app/class/educationnal-objective/educationnal-objective';
import { Mission } from 'src/app/class/mission/mission';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';

@Component({
  selector: 'app-educational-objective',
  templateUrl: './educational-objective.component.html',
  styleUrls: ['./educational-objective.component.scss']
})
export class EducationalObjectiveComponent implements OnInit {

  @Input() educationnalObjective: EducationnalObjective = new EducationnalObjective();
  @Input() scenario: Scenario = new Scenario();
  @Input() i: number = 0;

  constructor(private pieceDetailsService: PieceDetailsService) { }

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
    this.educationnalObjective.objective = '';
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
