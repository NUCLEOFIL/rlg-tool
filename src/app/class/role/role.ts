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
        if (this.chronologie.length - 1 == index) {
            this.chronologie.splice(index, 1);
        } else {
            this.chronologie[index] = null;
        }
    }

    public addTask(i: number, j: number, type: string) {
        this.tasks[i][j] = new Task(type);
        if (this.tasks[i + 1] == null) {
            this.tasks[i + 1] = [];
        }
    }

    public removeTask(i: number, j: number) {
        if (this.tasks[i].length - 1 == j) {
            this.tasks[i].splice(j, 1);
        } else {
            this.tasks[i][j] = null;
        }
        if (!this.tasks[i].some(element => element instanceof Task)) {
            this.tasks.splice(i, 1);
        }
    }

    public moveTask(i: number, j: number, direction: string): void {
        let tmp: Task | null = this.tasks[i][j] as Task;

        if (direction == 'left') {
            this.tasks[i][j] = this.tasks[i][j - 1];
            this.tasks[i][j - 1] = tmp;
        } else if (direction == 'right') {
            this.tasks[i][j] = this.tasks[i][j + 1];
            this.tasks[i][j + 1] = tmp;
        } else if (direction == 'top') {
            if (!(this.tasks[i - 1].some(element => element instanceof Task))) {
                this.tasks[i - 1][j] = tmp;
                this.tasks[i][j] = null;
            } else if (this.tasks[i - 1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
                if (this.tasks[i][j]?.type == 'final' || this.tasks[i][j]?.type == 'repeat') {
                    this.tasks[i][j] = this.tasks[i - 1][this.getLastTaskIndex(i - 1)];
                    this.tasks[i - 1][this.getLastTaskIndex(i - 1)] = tmp;
                }  else if (this.thereIsSpace(i - 1, this.getRealIndex(i-1,j), this.tasks[i][j] as Task)) {
                    this.tasks[i - 1][this.getRealIndex(i-1,j)] = tmp;
                    this.tasks[i][j] = null;
                    this.tasks[i - 1].splice(this.getRealIndex(i-1,j)+1,tmp?.duration-1);
                    for(let index = 1; index < tmp.duration; index++) {
                        this.tasks[i].splice(j+index,0,null);
                    }
                } else {
                    let deplace = this.tasks[i - 1][this.getLastTaskIndex(i - 1)];
                    this.tasks[i - 1][this.getLastTaskIndex(i - 1)] = tmp;
                    this.tasks[i - 1][this.getLastTaskIndex(i - 1) + 1] = deplace;
                    this.tasks[i][j] = null;
                }
            }  else if (this.thereIsSpace(i - 1, this.getRealIndex(i-1,j), this.tasks[i][j] as Task)) {
                this.tasks[i - 1][this.getRealIndex(i-1,j)] = tmp;
                this.tasks[i][j] = null;
                this.tasks[i - 1].splice(this.getRealIndex(i-1,j)+1,tmp.duration-1);
                for(let index = 1; index < tmp.duration; index++) {
                    this.tasks[i].splice(j+index,0,null);
                }
            } else {
                this.tasks[i - 1][this.getLastTaskIndex(i - 1) + 1] = tmp;
                this.tasks[i][j] = null;
            }
            if (!this.tasks[i].some(element => element instanceof Task)) {
                this.tasks.splice(i, 1);
            }
        } else if (direction == 'bottom') {
            if (this.tasks[i + 2] == null) {
                this.tasks[i + 2] = [];
            }
            if (!(this.tasks[i + 1].some(element => element instanceof Task))) {
                this.tasks[i + 1][j] = tmp;
                this.tasks[i][j] = null;
            } else if (this.tasks[i + 1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
                if (this.tasks[i][j]?.type == 'final' || this.tasks[i][j]?.type == 'repeat') {
                    this.tasks[i][j] = this.tasks[i + 1][this.getLastTaskIndex(i + 1)];
                    this.tasks[i + 1][this.getLastTaskIndex(i + 1)] = tmp;
                } else if (this.thereIsSpace(i + 1, this.getRealIndex(i+1,j), this.tasks[i][j] as Task)) {
                    this.tasks[i + 1][this.getRealIndex(i+1,j)] = tmp;
                    this.tasks[i][j] = null;
                    this.tasks[i + 1].splice(this.getRealIndex(i+1,j)+1,tmp?.duration-1);
                    for(let index = 1; index < tmp.duration; index++) {
                        this.tasks[i].splice(j+index,0,null);
                    }
                } else {
                    let deplace = this.tasks[i + 1][this.getLastTaskIndex(i + 1)];
                    this.tasks[i + 1][this.getLastTaskIndex(i + 1)] = tmp;
                    this.tasks[i + 1][this.getLastTaskIndex(i + 1) + 1] = deplace;
                    this.tasks[i][j] = null;
                }
            } else if (this.thereIsSpace(i + 1, this.getRealIndex(i+1,j), this.tasks[i][j] as Task)) {
                    this.tasks[i + 1][this.getRealIndex(i+1,j)] = tmp;
                    this.tasks[i][j] = null;
                    this.tasks[i + 1].splice(this.getRealIndex(i+1,j)+1,tmp.duration-1);    
                    for(let index = 1; index < tmp.duration; index++) {
                        this.tasks[i].splice(j+index,0,null);
                    }
            } else {
                this.tasks[i + 1][this.getLastTaskIndex(i + 1) + 1] = tmp;
                this.tasks[i][j] = null;
            }
        }
    }

    thereIsSpace(iDest: number, j: number, task: Task): boolean {
        let res: boolean = true;
        let spaceNecessary: number = 0;
        if (task.durationUnit == 'UT') {
            if (task.duration < 10) {
                spaceNecessary = task.duration;
            } else {
                spaceNecessary = 10;
            }
        } else {
            spaceNecessary = 1;
        }
        for(let i = 0; i < spaceNecessary; i++) {
            if (this.tasks[iDest][j+i] != null) {
                res = false;
            } 
        }
        return res;
    }

    /*
    getRealIndex(i: number, j: number): number {
        let realj: number = 0;
        let index: number = 0;
        
        while (index < j) {
            let task: Task|null = this.tasks[i][index];
            if (task instanceof Task) {
                if (task.durationUnit == 'UT') {
                    if (task.duration <= 10) {
                        index = index+task.duration;
                        realj++;
                    } else {
                        index = index + 10;
                        realj++;
                    }
                } else {
                    realj++;
                    index++;
                }
            } else {
                realj++;
                index++;
            }
        }
        return realj;
    }
    */

    getRealIndex(i: number, j: number): number {
        let realj: number = 0;

        for(let k = 0; k < j; k++) {
            let task: Task|null = this.tasks[i][k];
            if (task instanceof Task) {
                if (task.durationUnit == 'UT') {
                    if (task.duration <= 10) {
                        realj += task.duration;
                    } else {
                        realj =+ 10;
                    }
                } else {
                    realj++;
                }
            } else {
                realj++;
            }
        }

        return realj;
    }

    public moveStep(i: number, direction: string): void {
        let tmp: Step | null = this.chronologie[i];
        if (direction == 'left') {
            this.chronologie[i] = this.chronologie[i - 1];
            this.chronologie[i - 1] = tmp;
        } else if (direction == 'right') {
            this.chronologie[i] = this.chronologie[i + 1];
            this.chronologie[i + 1] = tmp;
        }
    }

    public getLastTaskIndex(i: number): number {
        let index: number;
        if (this.tasks[i].some(element => element instanceof Task)) {
            index = this.tasks[i].length - 1;
            while (!(this.tasks[i][index] instanceof Task)) {
                index--;
            }
        } else {
            index = 0;
        }
        return index;
    }

    public isAlreadyUsedIdentifier(identifier: string): boolean {
        let res: boolean = false;
        let cpt: number = 0;
        this.tasks.forEach(inlineTask => {
            inlineTask.forEach(task => {
                if (task?.identifier == identifier) {
                    cpt++;
                }
            });
        });
        if (cpt > 1) {
            res = true;
        }
        return res;
    }
}
