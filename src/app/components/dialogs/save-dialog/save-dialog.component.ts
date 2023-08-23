import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {fileName: string, result: boolean}) { }

  ngOnInit(): void {
  }

}
