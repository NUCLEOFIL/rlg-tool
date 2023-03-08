import { Step } from "../step/step";
import { Task } from "../task/task";

export class Role {

    intitule: string = '';
    questName: string = '';
    objective: string = '';
    rewards: string = '';
    comments: Comment[] = [];
    tasks: Task[][] = [
        [new Task('normal')]
    ]
    chronologie: Step[] = [];

}
