import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Step } from 'src/app/class/step/step';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

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
  pieceWidth: number = 400;

  constructor(private pieceDetailsService: PieceDetailsService, public dialog: MatDialog, protected tooltipService: TooltipService) { }

  ngOnInit(): void {
    this.setPieceWidth();
    this.mission.equalizeLengths();
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
      }
    });
  }

  moveStep(direction: string) {
    this.parent.moveStep(this.index, direction);
    this.displayMenu = 'hide';
    this.mission.equalizeLengths();
  }
}