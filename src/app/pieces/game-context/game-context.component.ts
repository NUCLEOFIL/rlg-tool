import { Component, Input, OnInit } from '@angular/core';
import { GameContext } from 'src/app/class/game-context/game-context';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-game-context',
  templateUrl: './game-context.component.html',
  styleUrls: ['./game-context.component.scss']
})
export class GameContextComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() gameContext: GameContext = new GameContext();

  constructor(private pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService) { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickErase(): void {
    this.gameContext.univers = '';
    this.gameContext.support = '';
    this.gameContext.duration = '';
    this.gameContext.intrigue = '';
    this.gameContext.other = '';
  } 

  onClickDots(): void {
    this.pieceDetailsService.piece = this.scenario;
  }

}
