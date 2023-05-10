import { Component, OnInit, Input } from '@angular/core';
import { GameEducationnalObjective } from 'src/app/class/game-educationnal-objective/game-educationnal-objective';

@Component({
  selector: 'app-game-educationnal-objective',
  templateUrl: './game-educationnal-objective.component.html',
  styleUrls: ['./game-educationnal-objective.component.scss']
})
export class GameEducationnalObjectiveComponent implements OnInit {

  @Input() gameEducationnalObjective: GameEducationnalObjective = new GameEducationnalObjective();

  constructor() { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickDots(): void {
    
  }

  onClickErase(): void {
    
  } 

}
