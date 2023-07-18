import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Character } from 'src/app/class/character/character';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { SuppressDialogComponent } from 'src/app/components/dialogs/suppress-dialog/suppress-dialog.component';
import { CreateDialogComponent } from 'src/app/components/dialogs/create-dialog/create-dialog.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() task: Task = new Task('normal');
  newCharacter: Character = new Character();
  selectedAssignCharacter!: Character | undefined;
  selectedDeleteCharacterIndex!: number;

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog) { }

  ngOnInit(): void {
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

  deleteCharacter(): void {
    if (this.selectedDeleteCharacterIndex != undefined) {
      const dialogRef = this.dialog.open(SuppressDialogComponent, { data: 'ce Personnage <'+this.scenario.characters[this.selectedDeleteCharacterIndex].name+'>' });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.scenario.missions.forEach(mission => {
            mission.roles.forEach(role => {
              role.tasks.forEach(inlineTask => {
                inlineTask.forEach(task => {
                  let index: number | undefined = task?.characters.findIndex(character => character == this.scenario.characters[this.selectedDeleteCharacterIndex]);
                  if (typeof index !== 'undefined' && index !== -1) {
                    task?.characters.splice(index, 1);
                  }
                });
              });
            });
          });
          this.scenario.characters.splice(this.selectedDeleteCharacterIndex, 1);
        }
      });
    }
  }

  assignCharacter(): void {
    if (this.selectedAssignCharacter != undefined) {
      this.task.characters.push(this.selectedAssignCharacter);
      this.selectedAssignCharacter = undefined;
    }
  }

  notAlreadyAssigned(character: Character): boolean {
    return !this.task.characters.includes(character);
  }
}
