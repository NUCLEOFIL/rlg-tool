import { Component, Input, OnInit } from '@angular/core';
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

}
