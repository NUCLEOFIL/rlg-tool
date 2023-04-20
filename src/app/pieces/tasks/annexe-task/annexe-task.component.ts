import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annexe-task',
  templateUrl: './annexe-task.component.html',
  styleUrls: ['./annexe-task.component.scss']
})
export class AnnexeTaskComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';
  displayPrequires: string = 'hide';

  durationUnit: string = 'UT';
  duration: number = 1;
  pieceWidth: string = '400px';
  
  durationChange(): void {
    if(this.durationUnit === 'UT') {
      if(this.duration >= 1  && this.duration <= 10) {
        this.pieceWidth = (this.duration*400)+'px';
      } else if(this.duration > 10) {
        this.pieceWidth = '4000px';
      } else {
        this.pieceWidth = '400px';
      }
    } else {
      this.pieceWidth = '400px';
    }
  }

  onClickErase(): void {
    
  } 

  onClickDots(): void {
    
  }

  onClickDelete(): void {

  }

  onClickChange(): void {
    
  }

  changeDisplayPrerequires(): void {
    if(this.displayPrequires == 'show') {
      this.displayPrequires = 'hide';
    } else {
      this.displayPrequires = 'show';
    }
  }

}
