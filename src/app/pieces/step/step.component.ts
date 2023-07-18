import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Step } from 'src/app/class/step/step';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';

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

  constructor(private pieceDetailsService: PieceDetailsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.durationChange();
  }

  onClickDots(): void {
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
