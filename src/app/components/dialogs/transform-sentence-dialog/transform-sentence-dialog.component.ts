import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transform-sentence-dialog',
  templateUrl: './transform-sentence-dialog.component.html',
  styleUrls: ['./transform-sentence-dialog.component.scss']
})
export class TransformSentenceDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {type: string}) { }

  ngOnInit(): void {
  }

}
