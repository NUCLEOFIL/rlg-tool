import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  durationUnit: String = 'UT';
  duration: number = 1;
  pieceWidth = '400px';
  
  durationChange():void {
    if(this.durationUnit === 'UT') {
      if(this.duration == 1) {
        this.pieceWidth = '400px';
      } else if(this.duration == 2) {
        this.pieceWidth = '800px';
      } else if(this.duration >= 3) {
        this.pieceWidth = '1200px';
      }
    } else {
      this.pieceWidth = '400px';
    }
    console.log('largeur : '+this.pieceWidth);
    console.log('durationUnit : '+this.durationUnit);
    console.log('duration : '+this.duration);
  }

}
