import { Component, Input, OnInit } from '@angular/core';
import { Step } from 'src/app/class/step/step';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  @Input() step: Step = new Step;

  displayMenu: string = 'hide';
  pieceWidth = '400px';

  constructor() { }

  ngOnInit(): void {
    this.durationChange();
  }

  onClickDots(): void {
    
  }

  onClickErase(): void {
    
  }

  onClickDelete(): void {
    
  }

  durationChange(): void {
    if(this.step.durationUnit === 'UT') {
      if(this.step.duration >= 1 && this.step.duration <= 10) {
        this.pieceWidth = (this.step.duration*400)+'px';
      } else if(this.step.duration > 10) {
        this.pieceWidth = '4000px';
      } else {
        this.pieceWidth = '400px';
      }
    } else {
      this.pieceWidth = '400px';
    }
  }

}
