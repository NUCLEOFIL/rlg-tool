import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EducationnalObjective } from 'src/app/class/educationnal-objective/educationnal-objective';
import { Mission } from 'src/app/class/mission/mission';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { CreateDialogComponent } from 'src/app/components/dialogs/create-dialog/create-dialog.component';

@Component({
  selector: 'app-educational-objective',
  templateUrl: './educational-objective.component.html',
  styleUrls: ['./educational-objective.component.scss']
})
export class EducationalObjectiveComponent implements OnInit {

  @Input() educationnalObjective: EducationnalObjective = new EducationnalObjective();
  @Input() scenario: Scenario = new Scenario();
  @Input() i: number = 0;

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario.missions[this.i];
  }

  onClickAdd(): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, { data: 'une nouvelle Mission' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.missions.push(new Mission());           
      }
    });
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Objectif pédagogique de la mission '+(this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.educationnalObjective.objective = '';              
      }
    });
  }

  onClickDelete(): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Mission '+(this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.missions.splice(this.i, 1);        
      }
    });
  }

  canDelete(): boolean {
    let res: boolean = true;
    if (this.scenario.missions.length <= 1) {
      res = false;
    }
    return res;
  }

}
