import { Step } from "../step/step";
import { Task } from "../task/task";
import { Ressource } from "../ressource/ressource";
import { SupplementaryRole } from "../supplementary-role/supplementary-role";

export class Role {

    intitule: string = '';
    questName: string = '';
    description: string = '';
    educationnalObjectives: string[] = [''];
    rewards: string = '';
    stuff: string = '';
    ressources: Ressource[] = [];
    supplementaryRoles: SupplementaryRole[] = [];
    comments: Comment[] = [];
    tasks: Task[][] = [
        [new Task('normal')]
    ]
    chronologie: Step[] = [];

}
