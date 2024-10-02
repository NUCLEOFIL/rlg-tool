import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Character } from 'src/app/class/character/character';
import { Repeat } from 'src/app/class/repeat/repeat';
import { CharacterReward } from 'src/app/class/rewards/character-reward/character-reward';
import { Role } from 'src/app/class/role/role';
import { Scenario } from 'src/app/class/scenario/scenario';
import { Symbol } from 'src/app/class/symbol/symbol';
import { Task } from 'src/app/class/task/task';

@Injectable({
  providedIn: 'root'
})
export class CopyTaskService {

  task: Task|null = null;
  role: Role|null = null;

  constructor() { }

  onClickCopy(scenario: Scenario, role: Role, task: Task) {
    let newTask: Task = Object.assign(new Task('normal'), task);
    newTask.prerequireRessources = [];
    newTask.prerequireTasks = [];
    newTask.symbol = Object.assign(new Symbol(), task.symbol);
    newTask.comments = [];
    newTask.repeat = Object.assign(new Repeat(), task.repeat);
    newTask.characters.forEach(character => {
      character = scenario.characters.find(element => element.color == character.color 
        && element.description == character.description 
        && element.name == character.name 
        && element.tel == character.tel
      ) as Character;
    });
    newTask.objectQuantity = 1;
    newTask.object = null;
    if (task.character) {
      newTask.character = scenario.characters.find(element => element.color == (task.character as Character).color 
        && element.description == (task.character as Character).description 
        && element.name == (task.character as Character).name
        && element.tel == (task.character as Character).tel
      ) as Character;      
    }
    newTask.combineObjects = [[null,1],[null,1]];
    newTask.giveObjects = [[null,1]];
    newTask.receiveObjects = [[null,1]];
    newTask.role = '';
    newTask.supplementaryRole = null;
    newTask.rewards = [];
    task.rewards.forEach(reward => {
      if (reward.type == 'character') {
        let newReward: CharacterReward = new CharacterReward();
        newReward.character = scenario.characters.find(element => element.color == (reward as CharacterReward).character.color 
          && element.description == (task.character as Character).description 
          && element.name == (task.character as Character).name
          && element.tel == (task.character as Character).tel
        ) as Character;
        newTask.rewards.push(newReward);
      }
    });
    this.role = role;
    this.task = newTask;
  }

  onClickPaste(scenario: Scenario): Task {
    let newTask: Task = Object.assign(new Task('normal'), this.task);
    newTask.prerequireRessources = [];
    newTask.prerequireTasks = [];
    newTask.symbol = Object.assign(new Symbol(), (this.task as Task).symbol);
    newTask.comments = [];
    newTask.repeat = Object.assign(new Repeat(), (this.task as Task).repeat);
    newTask.characters.forEach(character => {
      character = scenario.characters.find(element => element.color == character.color 
        && element.description == character.description 
        && element.name == character.name 
        && element.tel == character.tel
      ) as Character;
    });
    newTask.objectQuantity = 1;
    newTask.object = null;
    if (this.task?.character) {
      newTask.character = scenario.characters.find(element => element.color == ((this.task as Task).character as Character).color 
        && element.description == ((this.task as Task).character as Character).description 
        && element.name == ((this.task as Task).character as Character).name
        && element.tel == ((this.task as Task).character as Character).tel
      ) as Character;      
    }
    newTask.combineObjects = [[null,1],[null,1]];
    newTask.giveObjects = [[null,1]];
    newTask.receiveObjects = [[null,1]];
    newTask.role = '';
    newTask.supplementaryRole = null;
    newTask.rewards = [];
    (this.task as Task).rewards.forEach(reward => {
      if (reward.type == 'character') {
        let newReward: CharacterReward = new CharacterReward();
        newReward.character = scenario.characters.find(element => element.color == (reward as CharacterReward).character.color 
          && element.description == ((this.task as Task).character as Character).description 
          && element.name == ((this.task as Task).character as Character).name
          && element.tel == ((this.task as Task).character as Character).tel
        ) as Character;
        newTask.rewards.push(newReward);
      }
    });
    return newTask;
  }
}
