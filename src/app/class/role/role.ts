import { Step } from "../step/step";
import { Task } from "../task/task";
import { Ressource } from "../ressource/ressource";
import { SupplementaryRole } from "../supplementary-role/supplementary-role";
import { Reward } from "../rewards/reward";
import { RoleOccurrence } from "../role-occurrence/role-occurrence";
import { RoleEducationnalObjective } from "../role-educationnal-objective/role-educationnal-objective";
import { Comment } from "../comment/comment";

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
    occurences: RoleOccurrence[] = [new RoleOccurrence()];
    tasks: (Task | null)[][] = [[new Task('normal')], []];
    chronologie: (Step | null)[] = [];

    public addChronologieStep(index: number) {
        this.chronologie[index] = new Step();
    }

    public removeChronologieStep(index: number) {
        if (this.chronologie.length-1 == index) {
            this.chronologie.splice(index, 1);
        } else {
            this.chronologie[index] = null;
        }
    }

    public addTask(i: number, j: number, type: string) {
        this.tasks[i][j] = new Task(type);
        if (this.tasks[i+1] == null) {
            this.tasks[i+1] = [];
        }
    }

    public removeTask(i: number, j: number) {
        if (this.tasks[i].length-1 == j) {
            this.tasks[i].splice(j, 1);
        } else {
            this.tasks[i][j] = null;
        }
        if (!this.tasks[i].some(element => element instanceof Task)) {
            this.tasks.splice(i,1);
        }
    }

    public moveTask(i: number, j: number, direction: string): void {
        let tmp: Task|null = this.tasks[i][j];
        
        if (direction == 'left') {
            this.tasks[i][j] = this.tasks[i][j-1];
            this.tasks[i][j-1] = tmp;
        } else if (direction == 'right') {
            this.tasks[i][j] = this.tasks[i][j+1];
            this.tasks[i][j+1] = tmp;
        } else if (direction == 'top') {
            if (!(this.tasks[i-1].some(element => element instanceof Task))) {
                this.tasks[i-1][j] = tmp;
                this.tasks[i].splice(j, 1);
            } else if (this.tasks[i-1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
                if (this.tasks[i][j]?.type == 'final' || this.tasks[i][j]?.type == 'repeat') {
                    this.tasks[i][j] = this.tasks[i-1][this.getLastTaskIndex(i-1)];
                    this.tasks[i-1][this.getLastTaskIndex(i-1)] = tmp;
                } else {
                    let deplace = this.tasks[i-1][this.getLastTaskIndex(i-1)];
                    this.tasks[i-1][this.getLastTaskIndex(i-1)] = tmp;
                    this.tasks[i-1][this.getLastTaskIndex(i-1)+1] = deplace;
                    this.tasks[i].splice(j, 1);
                }
            } else {
                this.tasks[i-1][this.getLastTaskIndex(i-1)+1] = tmp;
                this.tasks[i].splice(j, 1);
            }
            if (!this.tasks[i].some(element => element instanceof Task)) {
                this.tasks.splice(i,1);
            }
        } else if (direction == 'bottom') {
            if (this.tasks[i+2] == null) {
                this.tasks[i+2] = [];
            }
            if (!(this.tasks[i+1].some(element => element instanceof Task))) {
                this.tasks[i+1][j] = tmp;
                this.tasks[i].splice(j, 1);
            } else if (this.tasks[i+1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
                if (this.tasks[i][j]?.type == 'final' || this.tasks[i][j]?.type == 'repeat') {
                    this.tasks[i][j] = this.tasks[i+1][this.getLastTaskIndex(i+1)];
                    this.tasks[i+1][this.getLastTaskIndex(i+1)] = tmp;
                } else {
                    let deplace = this.tasks[i+1][this.getLastTaskIndex(i+1)];
                    this.tasks[i+1][this.getLastTaskIndex(i+1)] = tmp;
                    this.tasks[i+1][this.getLastTaskIndex(i+1)+1] = deplace;
                    this.tasks[i].splice(j, 1);
                }
            } else {
                this.tasks[i+1][this.getLastTaskIndex(i+1)+1] = tmp;
                this.tasks[i].splice(j, 1);
            }
        }
    }

    public moveStep(i: number, direction: string): void {
        let tmp: Step|null = this.chronologie[i];
        if (direction == 'left') {
            this.chronologie[i] = this.chronologie[i-1];
            this.chronologie[i-1] = tmp;
        } else if (direction == 'right') {
            this.chronologie[i] = this.chronologie[i+1];
            this.chronologie[i+1] = tmp;
        }
    }

    public getLastTaskIndex(i: number): number {
        let index: number;
        if (this.tasks[i].some(element => element instanceof Task)) {
            index = this.tasks[i].length-1 ;
            while (!(this.tasks[i][index] instanceof Task)) {
                index--;
            }
        } else {
            index = 0;
        }
        return index;
    }
}
