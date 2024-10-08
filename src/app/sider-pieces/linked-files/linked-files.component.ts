import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LinkedFile } from 'src/app/class/linked-file/linked-file';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Step } from 'src/app/class/step/step';
import { Task } from 'src/app/class/task/task';
import { Trace } from 'src/app/class/trace/trace';
import { SupressLinkedFileDialogComponent } from 'src/app/components/dialogs/supress-linked-file-dialog/supress-linked-file-dialog.component';
import { PieceDetailsService } from 'src/app/services/piece-details/piece-details.service';
import { TooltipService } from 'src/app/services/tooltip/tooltip.service';
import { TracesService } from 'src/app/services/traces/traces.service';

@Component({
  selector: 'app-linked-files',
  templateUrl: './linked-files.component.html',
  styleUrls: ['./linked-files.component.scss']
})
export class LinkedFilesComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();
  @Input() piece!: Task | Role | Step | Mission | Scenario;
  @ViewChild('fileInput') fileInput: any;
  selectedFile: number = -1;

  constructor(protected tooltipService: TooltipService, private pieceDetailsService: PieceDetailsService, protected translate: TranslateService, private sanitizer: DomSanitizer, public dialog: MatDialog, private tracesService: TracesService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    let selectedFile: File = event.target.files[0];
    if (selectedFile) {
      let fileURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(selectedFile));
      let fileId: number = this.scenario.actualFileID++;
      let newFile: LinkedFile = new LinkedFile(fileId, selectedFile, fileURL)
      this.scenario.gameFiles.push(newFile);
      this.piece.files.push(fileId);
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'import',undefined,undefined,'file_[ID:'+fileId+']','Scenario','#C4B185',undefined,newFile.name+'.'+newFile.extension));
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'attach',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'file_[ID:'+fileId+']', this.formatTraceTarget(),'#C4B185'));
    }
  }

  getFileFromId(id: number): LinkedFile {
    return this.scenario.gameFiles.find(file => file.id == id) as LinkedFile;
  } 

  selectFile() {
    this.fileInput.nativeElement.click()
  }

  pieceContainAtLeastOneTypeFile(type: string): boolean {
    let contain: boolean = false;
    this.piece.files.forEach(fileId => {
      if (this.getFileFromId(fileId).folder == type) {
        contain = true;
      }
    });
    return contain;
  }

  scenarioContainAtLeastOneTypeSelectableFile(type: string): boolean {
    let contain: boolean = false;
    this.scenario.gameFiles.forEach(file => {
      if (file.folder == type && !this.isFileAffected(file.id)) {
        contain = true;
      }
    });
    return contain;
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
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'show',undefined,undefined,'file_[ID:'+fileId+']','Scenario','#C4B185'));
    }
  }

  isFileAffected(fileId: number): boolean {
    return this.piece.files.includes(fileId);
  }

  assignFile(): void {
    if (this.selectedFile !== -1) {
      this.piece.files.push(this.selectedFile);     
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'attach',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'file_[ID:'+this.selectedFile+']', this.formatTraceTarget(),'#C4B185'));
      this.selectedFile = -1;
    }
  }

  unassignFile(fileIndex: number, fileId: number): void {
    let file: LinkedFile = this.getFileFromId(fileId);
    let fileName: string = file.name+'.'+file.extension; 
    if (!this.isUsedFile(fileId)) {
      let index: number = this.scenario.gameFiles.findIndex(linkedFile => linkedFile.id == fileId) as number;
      const dialogRef = this.dialog.open(SupressLinkedFileDialogComponent, { data: {name: fileName, isUsed: false} });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.piece.files.splice(fileIndex,1);
          this.scenario.gameFiles.splice(index,1);
          this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'detach',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'file_[ID:'+fileId+']', this.formatTraceTarget(),'#C4B185'));
          this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'delete',undefined,undefined,'file_['+fileId+']','Scenario','#C4B185'));
        } else {
          this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'cancel_detach',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'file_[ID:'+fileId+']', this.formatTraceTarget(),'#C4B185'));
        }
      });
    } else {
      const dialogRef = this.dialog.open(SupressLinkedFileDialogComponent, { data: {name: fileName, isUsed: true} });
        dialogRef.afterClosed().subscribe(result => {
          if (result == true) {
            this.piece.files.splice(fileIndex,1);
            this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'detach',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'file_[ID:'+fileId+']', this.formatTraceTarget(),'#C4B185'));
          } else {
            this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'cancel_detach',this.pieceDetailsService.missionIndex,this.pieceDetailsService.roleIndex,'file_[ID:'+fileId+']', this.formatTraceTarget(),'#C4B185'));
          }
        });       
    }
  }

  isUsedFile(fileId: number): boolean {
    let used = false;
    if (this.scenario.files.includes(fileId) && this.scenario != this.piece) {
      used = true;
    }
    this.scenario.missions.forEach(mission => {
      if (mission.files.includes(fileId) && mission != this.piece) {
        used = true;
      }
      mission.chronologie.forEach(step => {
        if (step instanceof Step) {
          if (step.files.includes(fileId) && step != this.piece) {
            used = true;
          }
        }
      });
      mission.roles.forEach(role => {
        if (role.files.includes(fileId) && role != this.piece) {
          used = true;
        }
        role.chronologie.forEach(step => {
          if (step instanceof Step) {
            if (step.files.includes(fileId) && step != this.piece) {
              used = true;
            }
          }
        });
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

  editTrace(event: any, source: string, fileId: number): void {
    if (event.target.value != '') {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'write',undefined,undefined,source,'file_[ID:'+fileId+']', '#C4B185', undefined, event.target.value));
    } else {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'erase',undefined,undefined,source,'file_[ID:'+fileId+']', '#C4B185'));
    }
  }

  formatTraceTarget(): string {
    let res: string = '';

    if (this.piece instanceof Scenario) {
      res = 'Scenario';
    }
    if (this.piece instanceof Mission) {
      res = 'Mission_['+this.pieceDetailsService.missionIndex+']';
    }
    if (this.piece instanceof Role) {
      res = 'Role_['+this.pieceDetailsService.roleIndex+']';
    }
    if (this.piece instanceof Step) {
      if (this.pieceDetailsService.roleIndex == undefined) {
        res = 'Step_m_['+this.pieceDetailsService.pieceIndex+']';
      } else {
        res = 'Step_r_['+this.pieceDetailsService.pieceIndex+']';
      }
    }
    if (this.piece instanceof Task) {
      switch(this.piece.type) {
        case 'normal': res = 'Task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'annexe': res = 'Side_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'final': res = 'Final_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'optionnal': res = 'Opt_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'event': res = 'Event_task_['+this.pieceDetailsService.pieceIndex+']'; break;
        case 'repeat': res = 'Repeat_task_['+this.pieceDetailsService.pieceIndex+']'; break;
      }
    }

    return res;
  }
}
