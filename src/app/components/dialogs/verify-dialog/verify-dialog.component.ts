import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Mission } from 'src/app/class/mission/mission';
import { Role } from 'src/app/class/role/role';
import { Symbol } from 'src/app/class/symbol/symbol';
import { Task } from 'src/app/class/task/task';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-verify-dialog',
  templateUrl: './verify-dialog.component.html',
  styleUrls: ['./verify-dialog.component.scss']
})
export class VerifyDialogComponent implements OnInit {

  durationUnit: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public scenario: Scenario, protected translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  getAsSymbol(symbol: any): Symbol {
    return symbol as Symbol;
  }

  getMissionSymbols(mission: Mission): Symbol[] {
    let symbols: Symbol[] = [];
    mission.roles.forEach(role => {
      for (let i = 0; i < role.tasks.length; i++) {
        for (let j = 0; j < role.tasks[i].length; j++) {
          let task: Task|null = role.tasks[i][j];
          if (task instanceof Task && task.symbol.symbol && task.symbol.color && !symbols.some(symbol => task?.symbol.symbol == symbol.symbol && task.symbol.color == symbol.color)) {
            symbols.push(task.symbol);
          }
        }
      }
    });
    return symbols;
  }

  getRoleSymbolsAndIndex(mission: Mission): (Symbol|number)[][] {
    let symbols: (Symbol|number)[][] = []; // [0] => Symbol / [1] => role / [2] => visualIndex
    mission.roles.forEach((role, roleIndex) => {
      for (let i = 0; i < role.tasks.length; i++) {
        for (let j = 0; j < role.tasks[i].length; j++) {
          let task: Task|null = role.tasks[i][j];
          if (task instanceof Task && task.symbol.symbol && task.symbol.color) {
            symbols.push([task.symbol, roleIndex, role.getRealIndex(i,j)]);
          }
        }
      }
    });
    return symbols;
  }

  verifyRoleSymbolsMin(role: Role, roleIndex: number, symbolInfo: (Symbol | number)[]): number {
    let symbol: Symbol = symbolInfo[0] as Symbol;
    let symbolRoleIndex: number = symbolInfo[1] as number;
    let taskIndex: number = symbolInfo[2] as number;
    let time: number = 0;
    let optionnalUT: number[][] = []; //[[column,ut,ut,ut],[column,ut,ut]];
    if (roleIndex == symbolRoleIndex) {
      for (let i = 0; i < role.tasks.length; i++) {
        let j: number = 0;
        while (role.getRealIndex(i, j) < taskIndex) {
          let task: Task | null = role.tasks[i][j];
          if (task instanceof Task && task?.type != 'repeat' && task?.type != 'annexe' && task.symbol != symbol) {
            if (task?.type == 'optionnal') {
              let realj: number = role.getRealIndex(i, j);
              if (optionnalUT.some(element => element[0] == realj)) {
                optionnalUT[optionnalUT.findIndex(element => element[0] == realj)].push((task as Task).duration);
              } else {
                optionnalUT.push([realj, (task as Task).duration]);
              }
            } else {
              time = time + (task as Task).duration;
            }
          }
          j++;
        }
      }
      optionnalUT.forEach(optionnalTasks => {
        let min: number = optionnalTasks[1];
        for (let k = 2; k < optionnalTasks.length; k++) {
          if (optionnalTasks[k] < min) {
            min = optionnalTasks[k];
          }
        }
        time = time + min;
      });
    }
    return time;
  }

  verifyRoleSymbolsMax(role: Role, roleIndex: number, symbolInfo: (Symbol | number)[]): number {
    let symbol: Symbol = symbolInfo[0] as Symbol;
    let symbolRoleIndex: number = symbolInfo[1] as number;
    let taskIndex: number = symbolInfo[2] as number;
    let time: number = 0;
    if (symbolRoleIndex == roleIndex) {
      for (let i = 0; i < role.tasks.length; i++) {
        let j: number = 0;
        while (role.getRealIndex(i, j) <= taskIndex) {
          let task: Task | null = role.tasks[i][j];
          if (task instanceof Task && task?.type != 'repeat' && task.symbol != symbol) {
            time = time + (role.tasks[i][j] as Task).duration;
          }
          j++;
        }
      }
    }
    return time;
  }


  verifyRolesMin(role: Role): number {
    let time: number = 0;
    let optionnalUT: number[][] = []; //[[column,ut,ut,ut],[column,ut,ut]];
    for (let i = 0; i < role.tasks.length; i++) {
      for (let j = 0; j < role.tasks[i].length; j++) {
        if (role.tasks[i][j] instanceof Task && role.tasks[i][j]?.type != 'repeat' && role.tasks[i][j]?.type != 'annexe') {
          if (role.tasks[i][j]?.type == 'optionnal') {
            let realj: number = role.getRealIndex(i, j);
            if (optionnalUT.some(element => element[0] == realj)) {
              optionnalUT[optionnalUT.findIndex(element => element[0] == realj)].push((role.tasks[i][j] as Task).duration);
            } else {
              optionnalUT.push([realj, (role.tasks[i][j] as Task).duration]);
            }
          } else {
            time = time + (role.tasks[i][j] as Task).duration;
          }
          if (!this.durationUnit) {
            this.durationUnit = (role.tasks[i][j] as Task).durationUnit;
          }
        }
      }
    }
    optionnalUT.forEach(optionnalTasks => {
      let min: number = optionnalTasks[1];
      for (let k = 2; k < optionnalTasks.length; k++) {
        if (optionnalTasks[k] < min) {
          min = optionnalTasks[k];
        }
      }
      time = time + min;
    });
    return time;
  }

  verifyRoleMax(role: Role): number {
    let time: number = 0;
    for (let i = 0; i < role.tasks.length; i++) {
      for (let j = 0; j < role.tasks[i].length; j++) {
        if (role.tasks[i][j] instanceof Task && role.tasks[i][j]?.type != 'repeat') {
          time = time + (role.tasks[i][j] as Task).duration;
        }
      }
    }
    return time;
  }

  getRoleName(missionIndex: number, roleIndex: number): string {
    let name: string =  this.translate.instant('role_title')+' '+(roleIndex+1);
    if (this.scenario.missions[missionIndex].roles[roleIndex].intitule) {
      name = this.scenario.missions[missionIndex].roles[roleIndex].intitule;
    }
    return name;
  }

  getDurationUnit(): string {
    let durationUnit: string = this.translate.instant('step_duration_ut');
    switch(this.durationUnit) {
      case 'UT': durationUnit = this.translate.instant('step_duration_ut'); break;
      case 'min': durationUnit = this.translate.instant('step_duration_min'); break;
      case 'tours': durationUnit = this.translate.instant('step_duration_turn'); break;
    }
    return durationUnit;
  }

  getSymbolMaxOfMin(mission: Mission,symbol: Symbol): number {
    let time: number = 0;

    mission.roles.forEach((role, roleIndex) => {
      this.getRoleSymbolsAndIndex(mission).forEach(symbol2 => {
        if(this.getAsSymbol(symbol2[0]).symbol == symbol.symbol && this.getAsSymbol(symbol2[0]).color == symbol.color && this.verifyRoleSymbolsMax(role,roleIndex,symbol2)) {
          let tmp: number = this.verifyRoleSymbolsMin(role,roleIndex,symbol2);
          if (time == 0 || time < tmp) {
            time = tmp;
          }
        }  
      });
    });
    return time;
  }

  getSymbolMinOfMax(mission: Mission, symbol: Symbol): number {
    let time: number = 0;

    mission.roles.forEach((role, roleIndex) => {
      this.getRoleSymbolsAndIndex(mission).forEach(symbol2 => {
        if(this.getAsSymbol(symbol2[0]).symbol == symbol.symbol && this.getAsSymbol(symbol2[0]).color == symbol.color && this.verifyRoleSymbolsMax(role,roleIndex,symbol2)) {
          let tmp: number = this.verifyRoleSymbolsMax(role,roleIndex,symbol2);
          if (time == 0 || time > tmp) {
            time = tmp;
          }
        }  
      });
    });
    return time; 
  }

  getNumberOfSymbol(mission: Mission, symbol: Symbol): number {
    let number: number = 0;
    mission.roles.forEach((role, roleIndex) => {
      this.getRoleSymbolsAndIndex(mission).forEach(symbol2 => {
        if (this.getAsSymbol(symbol2[0]).symbol == symbol.symbol && this.getAsSymbol(symbol2[0]).color == symbol.color && this.verifyRoleSymbolsMax(role,roleIndex,symbol2)) {
          number = number + 1;
        }
      });
    });
    return number;
  }
}
