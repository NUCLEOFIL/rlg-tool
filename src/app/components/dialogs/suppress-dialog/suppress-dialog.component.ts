import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-suppress-dialog',
  templateUrl: './suppress-dialog.component.html',
  styleUrls: ['./suppress-dialog.component.scss']
})
export class SuppressDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

}
