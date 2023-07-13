import { Component, OnInit, Input } from '@angular/core';
import { GameEducationnalObjective } from 'src/app/class/game-educationnal-objective/game-educationnal-objective';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-game-educationnal-objective',
  templateUrl: './game-educationnal-objective.component.html',
  styleUrls: ['./game-educationnal-objective.component.scss']
})
export class GameEducationnalObjectiveComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() gameEducationnalObjective: GameEducationnalObjective = new GameEducationnalObjective();

  constructor(private pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService) { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickDots(): void {
    this.pieceDetailsService.piece = this.scenario;
  }

  onClickErase(): void {
    this.gameEducationnalObjective.objective = '';
  } 

}
