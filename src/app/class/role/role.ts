import { Step } from "../step/step";
import { Task } from "../task/task";
import { Ressource } from "../ressource/ressource";
import { SupplementaryRole } from "../supplementary-role/supplementary-role";
import { Reward } from "../rewards/reward";
import { RoleOccurrence } from "../role-occurrence/role-occurrence";
import { RoleEducationnalObjective } from "../role-educationnal-objective/role-educationnal-objective";
import { Comment } from "../comment/comment";
import { Discussion } from "../discussion/discussion";
import { Sentence } from "../sentence/sentence";
import { Response } from "../response/response";
import { Character } from "../character/character";

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
    discussions: Discussion[] = [];
    actualDiscussionID: number = 0;
    sentences: Sentence[] = [];
    actualSentenceID: number = 0;
    responses: Response[] = [];
    actualResponseID: number = 0;
    files: number[]  = [];

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

    public addOptionnalTask(i: number, j: number, type: string, quantity: number): void {
        this.tasks[i][j] = new Task(type);
        if (this.tasks[i + 1] == null) {
            this.tasks[i + 1] = [];
        } 
        if (quantity >= 1) {
            this.tasks[i][j] = new Task(type);
            if (this.tasks[i + 1] == null) {
                this.tasks[i + 1] = [];
            }
            let visualStartJ: number = this.getRealIndex(i, j);
            for (let k = 1; k < quantity; k++) {
                let secondi: number = i + 1;
                let realDestJ: number = this.getDestinationIndexFromRealIndex(visualStartJ, secondi);
                let visualDestJ: number = this.getRealIndex(secondi, realDestJ);
                while (this.tasks[secondi][realDestJ] instanceof Task || visualStartJ != visualDestJ) {
                    secondi++;
                    realDestJ = this.getDestinationIndexFromRealIndex(visualStartJ, secondi);
                    visualDestJ = this.getRealIndex(secondi, realDestJ);
                }
                this.tasks[secondi][this.getDestinationIndexFromRealIndex(this.getRealIndex(i, j), secondi)] = new Task(type);
                if (this.tasks[secondi + 1] == null) {
                    this.tasks[secondi + 1] = [];
                }
            }
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
                this.tasks[i - 1][this.getRealIndex(i,j)] = tmp;
                this.tasks[i][j] = null;
            } else if (this.tasks[i - 1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
                if (this.tasks[i][j]?.type == 'final' || this.tasks[i][j]?.type == 'repeat') {
                    this.tasks[i][j] = this.tasks[i - 1][this.getLastTaskIndex(i - 1)];
                    this.tasks[i - 1][this.getLastTaskIndex(i - 1)] = tmp;
                }  else if (this.thereIsSpace(i - 1, this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i-1), this.tasks[i][j] as Task)) {
                    this.tasks[i-1][this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i-1)] = tmp;
                    this.tasks[i][j] = null;
                    this.tasks[i - 1].splice(this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i-1)+1,tmp.duration-1);
                    for(let index = 1; index < tmp.duration; index++) {
                        this.tasks[i].splice(j+index,0,null);
                    }
                } else {
                    let deplace = this.tasks[i - 1][this.getLastTaskIndex(i - 1)];
                    this.tasks[i - 1][this.getLastTaskIndex(i - 1)] = tmp;
                    this.tasks[i - 1][this.getLastTaskIndex(i - 1) + 1] = deplace;
                    this.tasks[i][j] = null;
                }
            } else if (this.thereIsSpace(i - 1, this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i-1), this.tasks[i][j] as Task)) {
                this.tasks[i-1][this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i-1)] = tmp;
                this.tasks[i][j] = null;
                this.tasks[i - 1].splice(this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i-1)+1,tmp.duration-1);
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
                this.tasks[i + 1][this.getRealIndex(i,j)] = tmp;
                this.tasks[i][j] = null;
            } else if (this.tasks[i + 1].some(element => element?.type == 'final' || element?.type == 'repeat')) {
                if (this.tasks[i][j]?.type == 'final' || this.tasks[i][j]?.type == 'repeat') {
                    this.tasks[i][j] = this.tasks[i + 1][this.getLastTaskIndex(i + 1)];
                    this.tasks[i + 1][this.getLastTaskIndex(i + 1)] = tmp;
                } else if (this.thereIsSpace(i + 1, this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i+1), this.tasks[i][j] as Task)) {
                    this.tasks[i+1][this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i+1)] = tmp;
                    this.tasks[i][j] = null;
                    this.tasks[i + 1].splice(this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i+1)+1,tmp.duration-1);
                    for(let index = 1; index < tmp.duration; index++) {
                        this.tasks[i].splice(j+index,0,null);
                    }
                } else {
                    let deplace = this.tasks[i + 1][this.getLastTaskIndex(i + 1)];
                    this.tasks[i + 1][this.getLastTaskIndex(i + 1)] = tmp;
                    this.tasks[i + 1][this.getLastTaskIndex(i + 1) + 1] = deplace;
                    this.tasks[i][j] = null;
                }
            } else if (this.thereIsSpace(i + 1, this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i+1), this.tasks[i][j] as Task)) {
                this.tasks[i+1][this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i+1)] = tmp;
                this.tasks[i][j] = null;
                this.tasks[i + 1].splice(this.getDestinationIndexFromRealIndex(this.getRealIndex(i,j), i+1)+1,tmp.duration-1);
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

    getDestinationIndexFromRealIndex(realindex: number, iDest: number): number {
        let index: number = 0;
        while(this.getRealIndex(iDest, index) < realindex) {
            index++;
        }
        return index;
    }

    public moveStep(i: number, direction: string): number {
        let tmp: Step | null = this.chronologie[i];
        let newIndex: number = i;
        if (direction == 'left') {
            this.chronologie[i] = this.chronologie[i - 1];
            this.chronologie[i - 1] = tmp;
            newIndex = i-1;
        } else if (direction == 'right') {
            this.chronologie[i] = this.chronologie[i + 1];
            this.chronologie[i + 1] = tmp;
            newIndex = i+1;
        }
        return newIndex;
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

    public countOptionnalTasksInColumn(realColumn: number): number {
        let cpt: number = 0;
        
        this.tasks.forEach((inlineTasks, i) => {
            let j: number = 0; 
            while (this.getRealIndex(i,j) < realColumn) {
                j++;
            }
            if (inlineTasks[j]?.type == 'optionnal') {
                cpt++;
            }
        });
        
        return cpt;
    }

    characterHasDiscussion(char: Character): boolean {
        if (this.discussions.find(discussion => discussion.character == char) != undefined) {
            return true;
        } else {
            return false;
        }
    }
}
