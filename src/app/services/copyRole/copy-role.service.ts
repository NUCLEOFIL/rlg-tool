import { Injectable } from '@angular/core';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';

@Injectable({
  providedIn: 'root'
})
export class CopyRoleService {

  role: Role|null = null;
  mission: Mission|null = null;

  constructor() { }

}
