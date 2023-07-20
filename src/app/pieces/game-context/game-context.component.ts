import { Component, Input, OnInit } from '@angular/core';
import { GameContext } from 'src/app/class/game-context/game-context';
import { Scenario } from 'src/app/class/scenario/scenario';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-game-context',
  templateUrl: './game-context.component.html',
  styleUrls: ['./game-context.component.scss']
})
export class GameContextComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() gameContext: GameContext = new GameContext();

  constructor(private pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Contexte du jeu' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.gameContext.univers = '';
        this.gameContext.support = '';
        this.gameContext.duration = '';
        this.gameContext.intrigue = '';
        this.gameContext.other = '';                      
      }
    });
  } 

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
  }

}
