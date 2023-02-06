import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';
  displaySymbolChoice: string = 'hide';
  displayPrequires: string = 'hide';

  durationUnit: string = 'UT';
  duration: number = 1;
  pieceWidth: string = '400px';

  symbol: string = ''; // A changer quand implémentation des données
  symbolColor: string = ''; //A changer quand implémentation des données
  
  durationChange(): void {
    if(this.durationUnit === 'UT') {
      if(this.duration <= 1) {
        this.pieceWidth = '400px';
      } else if(this.duration == 2) {
        this.pieceWidth = '800px';
      } else if(this.duration >= 3) {
        this.pieceWidth = '1200px';
      }
    } else {
      this.pieceWidth = '400px';
    }
  }

  onClickComments(): void {
    
  }

  onClickAdd(): void {
    
  }

  onClickErase(): void {
    
  } 

  onClickDots(): void {
    
  }

  changeDisplaySymbolChoice(): void {
    if(this.displaySymbolChoice == 'show') {
      this.displaySymbolChoice = 'hide';
    } else {
      this.displaySymbolChoice = 'show';
    }
  }

  setSymbol(symbol: string, symbolColor: string): void {
    this.symbol = symbol;
    this.symbolColor = symbolColor;
    this.displaySymbolChoice = 'hide';
  }

  changeDisplayPrerequires(): void {
    if(this.displayPrequires == 'show') {
      this.displayPrequires = 'hide';
    } else {
      this.displayPrequires = 'show';
    }
  }

}


