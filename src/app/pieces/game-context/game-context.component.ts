import { Component, Input, OnInit } from '@angular/core';
import { GameContext } from 'src/app/class/game-context/game-context';

@Component({
  selector: 'app-game-context',
  templateUrl: './game-context.component.html',
  styleUrls: ['./game-context.component.scss']
})
export class GameContextComponent implements OnInit {

  @Input() gameContext: GameContext = new GameContext();

  constructor() { }

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
    
  }

}
