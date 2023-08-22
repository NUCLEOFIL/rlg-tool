import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MissionContext } from 'src/app/class/mission-context/mission-context';
import { Mission } from 'src/app/class/mission/mission';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { CreateDialogComponent } from 'src/app/components/dialogs/create-dialog/create-dialog.component';

@Component({
  selector: 'app-mission-context',
  templateUrl: './mission-context.component.html',
  styleUrls: ['./mission-context.component.scss']
})
export class MissionContextComponent implements OnInit {

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog) { }

  @Input() missionContext: MissionContext = new MissionContext();
  @Input() scenario: Scenario = new Scenario();
  @Input() i: number = 0;

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
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Contexte de la mission '+(this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.missionContext.duration = '';
        this.missionContext.intrigue = '';
        this.missionContext.communication = '';
        this.missionContext.various = '';                      
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
