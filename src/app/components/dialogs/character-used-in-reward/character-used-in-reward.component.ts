import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Character } from 'src/app/class/character/character';


export interface DialogData {
  character: Character,
  result: boolean
}

@Component({
  selector: 'app-character-used-in-reward',
  templateUrl: './character-used-in-reward.component.html',
  styleUrls: ['./character-used-in-reward.component.scss']
})
export class CharacterUsedInRewardComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CharacterUsedInRewardComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}
