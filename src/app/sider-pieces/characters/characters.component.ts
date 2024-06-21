import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Character } from 'src/app/class/character/character';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { UnityService } from 'src/app/services/unity/unity.service';

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

  constructor(protected tooltipService: TooltipService, public dialog: MatDialog, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService,
    protected unityService: UnityService) { }

  ngOnInit(): void {
  }

  assignCharacter(): void {
    if (this.selectedAssignCharacter != undefined) {
      this.task.characters.push(this.selectedAssignCharacter);
      this.selectedAssignCharacter = undefined;
      this.scenario.traces.push(new Trace(this.scenario.traces.length,'Select_character',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'character_['+(this.task.characters.length-1)+']',this.formatTraceTarget(),'#CE7B66'));
    }
  }

  notAlreadyAssigned(character: Character): boolean {
    return !this.task.characters.includes(character);
  }

  unassignCharacter(index: number): void {
    this.task.characters.splice(index, 1);
    this.scenario.traces.push(new Trace(this.scenario.traces.length,'Deselect_character',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'character_['+index+']',this.formatTraceTarget(),'#CE7B66'));
  }

  formatTraceTarget(): string {
    let res: string = '';

    if (this.pieceDetailsService.piece instanceof Task) {
      switch(this.pieceDetailsService.piece.type) {
        case 'normal': res = 'Task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'annexe': res = 'Side_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'final': res = 'Final_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'optionnal': res = 'Opt_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'event': res = 'Event_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'repeat': res = 'Repeat_task_['+this.pieceDetailsService.pieceIndex+']'; break;
      }
    }

    return res;
  }
}
