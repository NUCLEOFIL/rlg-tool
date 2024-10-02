import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-supress-linked-file-dialog',
  templateUrl: './supress-linked-file-dialog.component.html',
  styleUrls: ['./supress-linked-file-dialog.component.scss']
})
export class SupressLinkedFileDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string, isUsed: boolean}) { }

  ngOnInit(): void {
  }

}
