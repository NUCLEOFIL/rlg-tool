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
import { Trace } from 'src/app/class/trace/trace';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mission-context',
  templateUrl: './mission-context.component.html',
  styleUrls: ['./mission-context.component.scss']
})
export class MissionContextComponent implements OnInit {

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog, protected translate: TranslateService) { }

  @Input() missionContext: MissionContext = new MissionContext();
  @Input() scenario: Scenario = new Scenario();
  @Input() i: number = 0;

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario.missions[this.i];
    this.pieceDetailsService.missionIndex = this.i;
    this.pieceDetailsService.roleIndex = undefined;
    this.pieceDetailsService.pieceIndex = this.i;
  }

  onClickAdd(): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, { data: this.translate.instant('mission_new') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.missions.push(new Mission());
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',this.i,undefined,'all','Mission_['+(this.scenario.missions.length-1)+']'));        
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_new',this.i,undefined,'all','Mission_['+(this.scenario.missions.length-1)+']'));
      }
    });
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('missionContext_clean')+' '+(this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.missionContext.duration = '';
        this.missionContext.intrigue = '';
        this.missionContext.communication = '';
        this.missionContext.various = '';
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.i,undefined,'all','Context_m_['+(this.i)+']','#EAC19B'));                     
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',this.i,undefined,'all','Context_m_['+(this.i)+']','#EAC19B'));
      }
    });
  } 

  onClickDelete(): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('mission_delete')+' '+(this.i+1) });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.missions.splice(this.i, 1);
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',this.i,undefined,'all','Mission_['+(this.i)+']'));       
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',this.i,undefined,'all','Mission_['+(this.i)+']'));
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

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',this.i,undefined,source,'Context_m', '#EAC19B'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',this.i,undefined,source,'Context_m', '#EAC19B'));
    }
  }
}
