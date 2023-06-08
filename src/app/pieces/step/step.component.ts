import { Component, Input, OnInit } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Step } from 'src/app/class/step/step';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  @Input() step: Step = new Step;
  @Input() parent!: Mission | Role;
  @Input() index!: number;
  @Input() mission!: Mission;

  displayMenu: string = 'hide';
  pieceWidth = '400px';

  constructor() { }

  ngOnInit(): void {
    this.durationChange();
  }

  onClickDots(): void {
    
  }

  onClickErase(): void {
    this.step.description = '';
    this.step.durationUnit = 'UT';
    this.step.duration = 1;
  }

  onClickDelete(): void {
    if (this.parent instanceof Mission) {
      this.parent.removeChronologieStep(this.index);
    } else if (this.parent instanceof Role) {
      this.parent.removeChronologieStep(this.index);
    }
    this.mission.equalizeLengths();
  }

  durationChange(): void {
    /*
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
    */
  }

}
