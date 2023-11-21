import { Component, Input, OnInit } from '@angular/core';
import { GameContext } from 'src/app/class/game-context/game-context';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Trace } from 'src/app/class/trace/trace';
import { TranslateService } from '@ngx-translate/core';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';

@Component({
  selector: 'app-game-context',
  templateUrl: './game-context.component.html',
  styleUrls: ['./game-context.component.scss']
})
export class GameContextComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() gameContext: GameContext = new GameContext();

  constructor(protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog, protected translate: TranslateService, private tutorialService: TutorialService) { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: this.translate.instant('gameContext_title') });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.gameContext.univers = '';
        this.gameContext.support = '';
        this.gameContext.duration = '';
        this.gameContext.intrigue = '';
        this.gameContext.other = '';
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,'all','Context_g','#B6CC87'));                      
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',undefined,undefined,'all','Context_g','#B6CC87'));
      }
    });
  } 

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
    this.pieceDetailsService.missionIndex = undefined,
    this.pieceDetailsService.roleIndex = undefined;
    this.pieceDetailsService.pieceIndex = undefined;
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',undefined,undefined,source,'Context_g', '#B6CC87'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,source,'Context_g', '#B6CC87'));
    }
    if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 3) {
      this.scenario.traces.push(new Trace(this.scenario.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
      this.tutorialService.validPhase();
    }
  }
}
