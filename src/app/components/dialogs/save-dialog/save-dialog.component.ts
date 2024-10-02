import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {fileName: string, result: boolean}, protected translate: TranslateService) { }

  ngOnInit(): void {
  }

}
