import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  displayMenu: string = 'hide';
  pieceWidth = '400px';
  duration = 1;
  durationUnit = 'UT';

  constructor() { }

  ngOnInit(): void {
  }

  onClickDots(): void {
    
  }

  onClickErase(): void {
    
  }

  onClickDelete(): void {
    
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

}
