import { Component, Input, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { MatDialog } from '@angular/material/dialog';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { Scenario } from 'src/app/class/scenario/scenario';
import { CreateDialogComponent } from 'src/app/components/dialogs/create-dialog/create-dialog.component';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { Character } from 'src/app/class/character/character';
import { CleanDialogComponent } from 'src/app/components/dialogs/clean-dialog/clean-dialog.component';
import { Task } from 'src/app/class/task/task';

@Component({
  selector: 'app-game-characters',
  templateUrl: './game-characters.component.html',
  styleUrls: ['./game-characters.component.scss']
})
export class GameCharactersComponent implements OnInit {

  displayMenu: string = 'hide';
  @Input() scenario = new Scenario()
  newCharacter: Character = new Character();

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog, protected pieceDetailsService: PieceDetailsService) { }

  ngOnInit(): void {
  }

  onClickPiece(): void {
    this.pieceDetailsService.piece = this.scenario;
  }

  onClickErase(): void {
    const dialogRef = this.dialog.open(CleanDialogComponent, { data: 'Personnages (cela inclut la suppression de tous les personnages)' });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.newCharacter = new Character();
        this.scenario.characters = [];
        this.scenario.missions.forEach(mission => {
          mission.roles.forEach(role => {
            role.tasks.forEach(inlineTasks => {
              inlineTasks.forEach(task => {
                if (task instanceof Task) {
                  task.characters = [];
                }
              });
            });
          });
        });                   
      }
    });
  }

  createCharacter(): void {
    if (this.newCharacter.name != '') {
      const dialogRef = this.dialog.open(CreateDialogComponent, { data: 'un nouveau Personnage <'+this.newCharacter.name+'>' });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.scenario.characters.push(this.newCharacter);
          this.newCharacter = new Character();     
        }
      });
    }
  }

  deleteCharacter(index: number): void {
      const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'ce Personnage <'+this.scenario.characters[index].name+'>' });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.scenario.missions.forEach(mission => {
            mission.roles.forEach(role => {
              role.tasks.forEach(inlineTask => {
                inlineTask.forEach(task => {
                  let i: number | undefined = task?.characters.findIndex(character => character == this.scenario.characters[index]);
                  if (typeof i !== 'undefined' && i !== -1) {
                    task?.characters.splice(i, 1);
                  }
                });
              });
            });
          });
          this.scenario.characters.splice(index, 1);
        }
      });
    
  }

}
