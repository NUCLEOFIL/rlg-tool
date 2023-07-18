import { Component, Input, OnInit } from '@angular/core';
import { Ressource } from 'src/app/class/ressource/ressource';
import { Scenario } from 'src/app/class/scenario/scenario';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { MatDialog } from '@angular/material/dialog';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog) { }

  ngOnInit(): void {
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
