import { Component, OnInit, Input } from '@angular/core';
import { GameEducationnalObjective } from 'src/app/class/game-educationnal-objective/game-educationnal-objective';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Trace } from 'src/app/class/trace/trace';
import { TranslateService } from '@ngx-translate/core';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';

@Component({
  selector: 'app-game-educationnal-objective',
  templateUrl: './game-educationnal-objective.component.html',
  styleUrls: ['./game-educationnal-objective.component.scss']
})
export class GameEducationnalObjectiveComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() gameEducationnalObjective: GameEducationnalObjective = new GameEducationnalObjective();

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog, protected translate: TranslateService, private tutorialService: TutorialService) { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
    this.pieceDetailsService.missionIndex = undefined;
    this.pieceDetailsService.roleIndex = undefined;
    this.pieceDetailsService.pieceIndex = undefined;
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('gameEducationnalObjective_title') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.gameEducationnalObjective.objective = '';
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,'all','Obj_g','#BAC5D8'));                
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',undefined,undefined,'all','Obj_g','#BAC5D8'));
      }
    });  
  } 

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',undefined,undefined,source,'Obj_g', '#BAC5D8'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,source,'Obj_g', '#BAC5D8'));
    }
    if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 3
      && this.scenario.educationnalObjective.objective
      && this.scenario.context.univers && this.scenario.context.support && this.scenario.context.duration && this.scenario.context.intrigue && this.scenario.context.other
      && this.scenario.missions[0].context.duration && this.scenario.missions[0].context.intrigue && this.scenario.missions[0].context.communication && this.scenario.missions[0].context.various
      && this.scenario.missions[0].educationnalObjective.objective) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
      this.tutorialService.validPhase();
    }
  }
}
