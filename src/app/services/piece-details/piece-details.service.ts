import { Injectable } from '@angular/core';
import { Task } from 'src/app/class/task/task';
import { Role } from 'src/app/class/role/role';
import { Mission } from 'src/app/class/mission/mission';
import { Step } from 'src/app/class/step/step';
import { Scenario } from 'src/app/class/scenario/scenario';

@Injectable({
  providedIn: 'root'
})
export class PieceDetailsService {

  piece!: (Task | Role | Mission | Step | Scenario);
  parent!: (Role | Mission | Scenario);
  missionIndex: number|undefined = undefined;
  roleIndex: number|undefined = undefined;
  pieceIndex: number|number[]|undefined = undefined;

  constructor() { }

  pieceIsTask(): boolean {
    return this.piece instanceof Task;
  }

  pieceIsRole(): boolean {
    return this.piece instanceof Role;
  }

  pieceIsMission(): boolean {
    return this.piece instanceof Mission;
  }

  pieceIsStep(): boolean {
    return this.piece instanceof Step;
  }

  pieceIsScenario(): boolean {
    return this.piece instanceof Scenario;
  }

  pieceAsTask(): Task {
    return this.piece as Task;
  }

  pieceAsRole(): Role {
    return this.piece as Role;
  }

  pieceAsMission(): Mission {
    return this.piece as Mission;
  }

  pieceAsStep(): Step {
    return this.piece as Step;
  }

  pieceAsScenario(): Scenario {
    return this.piece as Scenario;
  }

  parentAsRole(): Role {
    return this.parent as Role;
  }
}
