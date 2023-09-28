import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Step } from 'src/app/class/step/step';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { Trace } from 'src/app/class/trace/trace';
import { Scenario } from 'src/app/class/scenario/scenario';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() step: Step = new Step();
  @Input() parent!: Mission | Role;
  @Input() index!: number;
  @Input() mission!: Mission;
  @Input() roleIndex!: number;
  @Input() missionIndex: number = 0;

  displayMenu: string = 'hide';
  pieceWidth: number = 400;
  urlIcon: string = 'url("../../../assets/background-images/step.png")';

  constructor(protected pieceDetailsService: PieceDetailsService, public dialog: MatDialog, protected tooltipService: TooltipService) { }

  ngOnInit(): void {
    this.setPieceWidth();
    this.mission.equalizeLengths();
  }

  getStepNumber(): number {
    let number: number = 1;
    for(let i = 0; i < this.index; i++) {
      if (this.parent.chronologie[i] instanceof Step) {
        number++;
      }
    }
    return number;
  }
  
  durationChange(): void {
    let beforeWidth: number = this.pieceWidth;
    this.setPieceWidth();
    let afterWidth: number = this.pieceWidth;
    let difference: number;
    // Increase
    if (beforeWidth < afterWidth) {
      difference = (afterWidth/beforeWidth)-1;
      for(let k = 0; k < difference; k++) {
        if (!(this.parent.chronologie[this.index+k+1] instanceof Step)) {
          this.parent.chronologie.splice(this.index+k+1, 1);
        }
      }
    }
    // Decrease
    if (afterWidth < beforeWidth) {
      difference = (beforeWidth/afterWidth)-1
      for (let k = 0; k < difference; k++) {
        this.parent.chronologie.splice(this.index+k+1, 0, null);
      }
    }
    this.mission.equalizeLengths();
  }

  setPieceWidth(): void {
    if(this.step.durationUnit === 'UT') {
      if(this.step.duration >= 1 && this.step.duration <= 10) {
        this.pieceWidth = (this.step.duration*400);
      } else if(this.step.duration > 10) {
        this.pieceWidth = 4000;
      } else {
        this.pieceWidth = 400;
      }
    } else {
      this.pieceWidth = 400;
    }
  }

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.step;
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Étape' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.step.description = '';
        this.step.durationUnit = 'UT';
        this.step.duration = 1;
        if (this.parent instanceof Mission) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,undefined,'all','Step_m_['+this.index+']','#ACC9FC'));
        } else if (this.parent instanceof Role) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.roleIndex,'all','Step_r_['+this.index+']','#ACC9FC'));
        }
      } else {
        if (this.parent instanceof Mission) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.missionIndex,undefined,'all','Step_m_['+this.index+']','#ACC9FC'));
        } else if (this.parent instanceof Role) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.missionIndex,this.roleIndex,'all','Step_r_['+this.index+']','#ACC9FC'));
        }
      }
    });
  }

  onClickDelete(): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Étape de '+(this.parent instanceof Mission ? 'Mission' : 'Rôle') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (this.parent instanceof Mission) {
          this.parent.removeChronologieStep(this.index);
        } else if (this.parent instanceof Role) {
          this.parent.removeChronologieStep(this.index);
        }
        this.mission.equalizeLengths();       
        if (this.parent instanceof Mission) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.missionIndex,undefined,'all','Step_m_['+this.index+']','#ACC9FC'));
        } else if (this.parent instanceof Role) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.roleIndex,'all','Step_r_['+this.index+']','#ACC9FC'));
        }
      } else {
        if (this.parent instanceof Mission) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.missionIndex,undefined,'all','Step_m_['+this.index+']','#ACC9FC'));
        } else if (this.parent instanceof Role) {
          this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.missionIndex,this.roleIndex,'all','Step_r_['+this.index+']','#ACC9FC'));
        }
      }
    });
  }

  moveStep(direction: string) {
    this.parent.moveStep(this.index, direction);
    this.displayMenu = 'hide';
    this.mission.equalizeLengths();
  }

  FirstStepIndex(): number {
    for(let i = 0; i < this.parent.chronologie.length; i++) {
      if (this.parent.chronologie[i] instanceof Step) {
        return i;
      }
    }
    return 0;
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      if (this.parent instanceof Mission) {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.missionIndex,undefined,source,'Step_m_['+this.index+']','#ACC9FC'));
      } else if (this.parent instanceof Role) {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.missionIndex,this.roleIndex,source,'Step_r_['+this.index+']','#ACC9FC'));
      }
    } else {
      if (this.parent instanceof Mission) {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,undefined,source,'Step_m_['+this.index+']','#ACC9FC'));
      } else if (this.parent instanceof Role) {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.missionIndex,this.roleIndex,source,'Step_r_['+this.index+']','#ACC9FC'));
      }
    }
  }

  editMoveTrace(event: any, source: string): void {
    if (event.target.value != '') {
      if (this.parent instanceof Mission) {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'move',this.missionIndex,undefined,source,'Step_m_['+this.index+']','#ACC9FC'));
      } else if (this.parent instanceof Role) {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'move',this.missionIndex,this.roleIndex,source,'Step_r_['+this.index+']','#ACC9FC'));
      }
    }
  }
}