import { Component, Input, OnInit } from '@angular/core';
import { Ressource } from 'src/app/class/ressource/ressource';
import { Scenario } from 'src/app/class/scenario/scenario';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { MatDialog } from '@angular/material/dialog';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { MinimapService } from 'src/app/services/minimap/minimap.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  displayMenu: string = 'hide';
  @Input() scenario: Scenario = new Scenario();

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog, protected pieceDetailsService: PieceDetailsService, private minimapService: MinimapService) { }

  ngOnInit(): void {
  }

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
    this.pieceDetailsService.missionIndex = undefined;
    this.pieceDetailsService.roleIndex = undefined;
    this.pieceDetailsService.pieceIndex = undefined;
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Règles du jeu (cela inclut la suppression de toutes les ressources)' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.scenario.gameRules = '';
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
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,'all','Rules', '#C6C2BD'));
        this.minimapService.reset();
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_erase',undefined,undefined,'all','Rules', '#C6C2BD'));
      }
    });
  }

  addRessource(): void {
    this.scenario.ressources.push(new Ressource());
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'new',undefined,undefined,'Ressource_['+(this.scenario.traces.length-1)+']','Rules', '#C6C2BD'));
    this.minimapService.reset();
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
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'delete',undefined,undefined,'Ressource_['+index+']','Rules', '#C6C2BD'));
        this.minimapService.reset();
      } else {
        this.scenario.traces.push(new Trace(this.scenario.traces.length,'cancel_delete',undefined,undefined,'Ressource_['+index+']','Rules', '#C6C2BD'));
      }
    });
  }

  editTrace(event: any, source: string): void {
    if (event.target.value != '') {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'write',undefined,undefined,source,'Rules', '#C6C2BD'));
    } else {
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'erase',undefined,undefined,source,'Rules', '#C6C2BD'));
    }
  }
}
