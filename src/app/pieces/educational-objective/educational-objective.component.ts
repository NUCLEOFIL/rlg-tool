import { Component, Input, OnInit } from '@angular/core';
import { EducationnalObjective } from 'src/app/class/educationnal-objective/educationnal-objective';

@Component({
  selector: 'app-educational-objective',
  templateUrl: './educational-objective.component.html',
  styleUrls: ['./educational-objective.component.scss']
})
export class EducationalObjectiveComponent implements OnInit {

  @Input() educationnalObjective: EducationnalObjective = new EducationnalObjective();

  constructor() { }

  ngOnInit(): void {
  }

  displayMenu: string = 'hide';

  onClickDots(): void {

  }

  onClickAdd(): void {
    
  }

  onClickErase(): void {
    
  }

}
