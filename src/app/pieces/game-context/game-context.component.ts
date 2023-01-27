import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-context',
  templateUrl: './game-context.component.html',
  styleUrls: ['./game-context.component.scss']
})
export class GameContextComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayMenu: String = 'hide';

  onClickComments(): void {
    
  }

  onClickErase(): void {
    
  } 

  onClickDots(): void {
    
  }

}
