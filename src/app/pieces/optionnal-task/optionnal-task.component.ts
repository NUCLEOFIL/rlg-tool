import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-optionnal-task',
  templateUrl: './optionnal-task.component.html',
  styleUrls: ['./optionnal-task.component.scss']
})
export class OptionnalTaskComponent implements OnInit {

  displayMenu: string = 'hide';
  displaySymbolChoice: string = 'hide';
  displayPrequires: string = 'hide';

  durationUnit: string = 'UT';
  duration: number = 1;
  pieceWidth: string = '400px';

  symbol: string = ''; // A changer quand implémentation des données
  symbolColor: string = ''; //A changer quand implémentation des données

  constructor() { }

  ngOnInit(): void {
  }

  
  durationChange(): void {
    if(this.durationUnit === 'UT') {
      if(this.duration >= 1 && this.duration <= 10) {
        this.pieceWidth = (this.duration*400)+'px';
      } else if(this.duration > 10) {
        this.pieceWidth = '4000px';
      } else {
        this.pieceWidth = '400px';
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
