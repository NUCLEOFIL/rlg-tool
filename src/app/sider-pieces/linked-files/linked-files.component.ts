import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LinkedFile } from 'src/app/class/linked-file/linked-file';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';

@Component({
  selector: 'app-linked-files',
  templateUrl: './linked-files.component.html',
  styleUrls: ['./linked-files.component.scss']
})
export class LinkedFilesComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() piece!: Task;
  @ViewChild('fileInput') fileInput: any;

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    let selectedFile: File = event.target.files[0];
    if (selectedFile) {
      let fileURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(selectedFile));
      let fileId: number = this.scenario.actualFileID++;
      this.scenario.files.push(new LinkedFile(fileId, selectedFile, fileURL));
      this.piece.files.push(fileId);
      console.log(this.getFileFromId(fileId).file);
    }
  }

  getFileFromId(id: number): LinkedFile {
    return this.scenario.files.find(file => file.id == id) as LinkedFile;
  } 

  selectFile() {
    this.fileInput.nativeElement.click()
  }

}
