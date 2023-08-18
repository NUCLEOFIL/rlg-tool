import { Component, Input, OnInit } from '@angular/core';
import { Ressource } from 'src/app/class/ressource/ressource';
import { Scenario } from 'src/app/class/scenario/scenario';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { MatDialog } from '@angular/material/dialog';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  displayMenu: string = 'hide';
  @Input() scenario: Scenario = new Scenario();

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog, private pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
  }

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Règles du jeu (cela inclut la suppression de toutes les ressources)' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.gameRules = '';
        //this.scenario.ressources = [];
        this.scenario.ressources.forEach((ressource, i) => {
          this.scenario.missions.forEach(mission => {
            mission.roles.forEach(role => {
              role.tasks.forEach(inlineTasks => {
                inlineTasks.forEach(task => {
                  if (task instanceof Task) {
                    task.prerequireRessources.forEach((taskRessource, j) => {
                      if (ressource == taskRessource.ressource) {
                        task.prerequireRessources.splice(j, 1);
                      }
                    });
                  }
                });
              });
            });
          });
        });
        this.scenario.ressources = [];
      }
    });
  }

  addRessource(): void {
    this.scenario.ressources.push(new Ressource());
  }

  removeRessource(index: number): void {
    const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'cette Ressource' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.missions.forEach(mission => {
          mission.roles.forEach(role => {
            role.tasks.forEach(inlineTasks => {
              inlineTasks.forEach(task => {
                task?.prerequireRessources.forEach((prerequire, j) => {
                  if (this.scenario.ressources[index] == prerequire.ressource) {
                    task.prerequireRessources.splice(j, 1);
                  }
                });
              });
            });
          });
        });
        this.scenario.ressources.splice(index, 1);
      }
    });
  }
}
