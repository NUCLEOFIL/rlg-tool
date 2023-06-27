import { Component, Input, OnInit } from '@angular/core';
import { RoleOccurrence } from 'src/app/class/role-occurrence/role-occurrence';
import { Role } from 'src/app/class/role/role';

@Component({
  selector: 'app-role-occurence',
  templateUrl: './role-occurence.component.html',
  styleUrls: ['./role-occurence.component.scss']
})
export class RoleOccurenceComponent implements OnInit {

  @Input() role: Role = new Role();

  constructor() { }

  ngOnInit(): void {
  }

  addOccurrence(): void {
    this.role.occurences.push(new RoleOccurrence());
  }

  removeOccurrence(index: number): void {
    this.role.occurences.splice(index, 1);
  }

}
