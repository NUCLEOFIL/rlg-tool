import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-clean-dialog',
  templateUrl: './clean-dialog.component.html',
  styleUrls: ['./clean-dialog.component.scss']
})
export class CleanDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

}
