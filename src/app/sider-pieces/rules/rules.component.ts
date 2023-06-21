import { Component, Input, OnInit } from '@angular/core';
import { Ressource } from 'src/app/class/ressource/ressource';
import { Scenario } from 'src/app/class/scenario/scenario';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  @Input() scenario: Scenario = new Scenario();

  constructor() { }

  ngOnInit(): void {
  }

  addRessource(): void {
    this.scenario.ressources.push(new Ressource());
  }

  removeRessource(index: number): void {
    this.scenario.ressources.splice(index, 1);
  }

}
