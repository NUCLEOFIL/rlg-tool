import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LinkedFile } from 'src/app/class/linked-file/linked-file';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Task } from 'src/app/class/task/task';
import { SupressLinkedFileDialogComponent } from 'src/app/components/dialogs/supress-linked-file-dialog/supress-linked-file-dialog.component';
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
  selectedFile: number = -1;

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService, private sanitizer: DomSanitizer, public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    let selectedFile: File = event.target.files[0];
    if (selectedFile) {
      let fileURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(selectedFile));
      let fileId: number = this.scenario.actualFileID++;
      this.scenario.files.push(new LinkedFile(fileId, selectedFile, fileURL));
      this.piece.files.push(fileId);
    }
  }

  getFileFromId(id: number): LinkedFile {
    return this.scenario.files.find(file => file.id == id) as LinkedFile;
  } 

  selectFile() {
    this.fileInput.nativeElement.click()
  }

  consultFile(fileId: number) {
    let file: LinkedFile = this.getFileFromId(fileId);
    const url = this.sanitizer.sanitize(4, file.fileURL);
    if (url) {
      let detailWindow = window.open(url, '_blank') as Window || null;
      if (detailWindow !== null) {
        detailWindow.onload = () => {
          detailWindow.document.title = 'RLG Maker - '+file.file.name;
        };
      }
    }
  }

  isFileAffected(fileId: number): boolean {
    return this.piece.files.includes(fileId);
  }

  assignFile(): void {
    if (this.selectedFile !== -1) {
      this.piece.files.push(this.selectedFile);     
      this.selectedFile = -1;
    }
  }

  unassignFile(fileIndex: number, fileId: number): void {
    let file: LinkedFile = this.getFileFromId(fileId);
    let fileName: string = file.name+'.'+file.extension; 
    if (!this.isUsedFile(fileId)) {
      let index: number = this.scenario.files.findIndex(linkedFile => linkedFile.id == fileId) as number;
      const dialogRef = this.dialog.open(SupressLinkedFileDialogComponent, { data: {name: fileName, isUsed: false} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.piece.files.splice(fileIndex,1);
          this.scenario.files.splice(index,1);
        } else {

        }
      });
    } else {
      const dialogRef = this.dialog.open(SupressLinkedFileDialogComponent, { data: {name: fileName, isUsed: true} });
        dialogRef.afterClosed().subscribe(result => {
          if (result == true) {
            this.piece.files.splice(fileIndex,1);
          } else {

          }
        });       
    }

    console.log(this.scenario.files);

  }

  isUsedFile(fileId: number): boolean {
    let used = false;
    this.scenario.missions.forEach(mission => {
      mission.roles.forEach(role => {
        role.tasks.forEach(inlineTask => {
          inlineTask.forEach(task => {
            if (task instanceof Task) {
              if (task.files.includes(fileId) && task != this.piece) {
                used = true;
              }
            }
          });
        });
      });
    });
    return used;
  }
}
