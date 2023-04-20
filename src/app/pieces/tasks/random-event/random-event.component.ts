import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-random-event',
  templateUrl: './random-event.component.html',
  styleUrls: ['./random-event.component.scss']
})
export class RandomEventComponent implements OnInit {

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
      if(this.duration >= 1  && this.duration <= 10) {
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

  onClickErase(): void {
    
  } 

  onClickDots(): void {
    
  }

  onClickDelete(): void {
    
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
