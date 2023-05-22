import { Step } from "../step/step";
import { Task } from "../task/task";
import { Ressource } from "../ressource/ressource";
import { SupplementaryRole } from "../supplementary-role/supplementary-role";
import { Reward } from "../rewards/reward";
import { RoleOccurrence } from "../role-occurrence/role-occurrence";
import { RoleEducationnalObjective } from "../role-educationnal-objective/role-educationnal-objective";

export class Role {

    intitule: string = '';
    questName: string = '';
    description: string = '';
    educationnalObjectives: RoleEducationnalObjective[] = [new RoleEducationnalObjective()];
    rewards: Reward[] = [];
    stuff: string = '';
    ressources: Ressource[] = [];
    supplementaryRoles: SupplementaryRole[] = [];
    comments: Comment[] = [];
    occurences: RoleOccurrence[] = [new RoleOccurrence()]
    tasks: Task[][] = [
        [new Task('normal')]
    ]
    chronologie: Step[] = [];

}
