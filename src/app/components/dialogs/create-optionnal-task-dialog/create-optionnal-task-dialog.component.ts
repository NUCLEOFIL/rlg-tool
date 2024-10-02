import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  quantity: number;
  minquantity: number;
  result: boolean;
}

@Component({
  selector: 'app-create-optionnal-task-dialog',
  templateUrl: './create-optionnal-task-dialog.component.html',
  styleUrls: ['./create-optionnal-task-dialog.component.scss']
})
export class CreateOptionnalTaskDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateOptionnalTaskDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }
}
