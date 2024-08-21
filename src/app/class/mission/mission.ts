import { EducationnalObjective } from "../educationnal-objective/educationnal-objective";
import { MissionContext } from "../mission-context/mission-context";
import { Role } from "../role/role";
import { Step } from "../step/step";
import { Task } from "../task/task";
import { Comment } from "../comment/comment";
import { Reward } from "../rewards/reward";

export class Mission {

    educationnalObjective: EducationnalObjective = new EducationnalObjective();
    context: MissionContext = new MissionContext();
    roles: Role[] = [new Role(), new Role()];
    chronologie: (Step | null)[] = [new Step()];
    comments: Comment[] = [];
    rewards: Reward[] = [];

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

    public moveStep(i: number, direction: string): number {
        let tmp: Step|null = this.chronologie[i];
        let newIndex: number = i;
        if (direction == 'left') {
            this.chronologie[i] = this.chronologie[i-1];
            this.chronologie[i-1] = tmp;
            newIndex = i-1;
        } else if (direction == 'right') {
            this.chronologie[i] = this.chronologie[i+1];
            this.chronologie[i+1] = tmp;
            newIndex = i+1;
        }
        return newIndex;
    }
    
    public equalizeLengths(): void {
        this.unequalizeLenghts();

        let maxLineLength: number = this.calcMaxLineLength()-1;

        if (!(this.chronologie[maxLineLength - this.sumUT(this.chronologie)] instanceof Step)) {
            this.chronologie[maxLineLength - this.sumUT(this.chronologie)] = null;
        }

        this.roles.forEach(role => {
            if (!(role.chronologie[maxLineLength - this.sumUT(role.chronologie)] instanceof Step)) {
                role.chronologie[maxLineLength - this.sumUT(role.chronologie)] = null;
            }

            role.tasks.forEach(inlineTasks => {
                if (!(inlineTasks.some(task => task?.type == 'final') || inlineTasks.some(task => task?.type == 'repeat'))) {
                    if (!(inlineTasks[maxLineLength - this.sumUT(inlineTasks)] instanceof Task)) {
                        inlineTasks[maxLineLength - this.sumUT(inlineTasks)] = null;
                    }
                }
            });
        });
    }

    public calcMaxLineLength(): number {
        let length: number = 0;
        let cpt: number = 0;

        // Pour chaque étape de mission
        for (let j = 0; j < this.chronologie.length; j++) {
            let step: Step | null = this.chronologie[j];
            if (step != null && step.durationUnit == 'UT') {
                if (step.duration > 0) {
                    if (step.duration <= 10) {
                        cpt = cpt + step.duration;
                    } else {
                        cpt = cpt + 10;
                    }
                } else {
                    cpt = cpt + 1;
                }
            } else {
                cpt = cpt + 1;
            }
        }
        if (cpt > length) {
            length = cpt;
        }
        cpt = 0;

        // Pour chaque role
        for (let k = 0; k < this.roles.length; k++) {
            let role: Role = this.roles[k];

            // Pour chaque étape du role
            for (let l = 0; l < role.chronologie.length; l++) {
                let step: Step | null = role.chronologie[l];
                if (step != null && step.durationUnit == 'UT') {
                    if (step.duration > 0) {
                        if (step.duration <= 10) {
                            cpt = cpt + step.duration;
                        } else {
                            cpt = cpt + 10;
                        }
                    } else {
                        cpt = cpt + 1;
                    }
                } else {
                    cpt = cpt + 1;
                }
            }
            if (cpt > length) {
                length = cpt;
            }
            cpt = 0;

            // Pour chaque ligne de tâche
            for (let m = 0; m < role.tasks.length; m++) {
                let inlineTasks: (Task | null)[] = role.tasks[m];
                // Pour chaque tâche
                for (let n = 0; n < inlineTasks.length; n++) {
                    let task: Task | null = inlineTasks[n];
                    if (task != null && task.durationUnit == 'UT') {
                        if (task.duration > 0) {
                            if (task.duration <= 10) {
                                cpt = cpt + task.duration;
                            } else {
                                cpt = cpt + 10;
                            }
                        } else {
                            cpt = cpt + 1;
                        }
                    } else {
                        cpt = cpt + 1;
                    }
                }
                if (cpt > length) {
                    length = cpt;
                }
                cpt = 0;
            }
        }
        return length;
    }

    public unequalizeLenghts(): void {
        //Pour la chronologie
        if (this.chronologie.some(element => element instanceof Step)) {
            let lastIndexStep = this.chronologie.length - 1;
            while (!(this.chronologie[lastIndexStep] instanceof Step)) {
                lastIndexStep--;
            }
            this.chronologie.splice(lastIndexStep + 1, this.chronologie.length);
        } else {
            this.chronologie = [];
        }

        // Pour chaque role
        this.roles.forEach(role => {
            // Pour la chronologie du role
            if (role.chronologie.some(element => element instanceof Step)) {
                let lastIndexStep = role.chronologie.length - 1;
                while (!(role.chronologie[lastIndexStep] instanceof Step)) {
                    lastIndexStep--;
                }
                role.chronologie.splice(lastIndexStep + 1, role.chronologie.length);
            } else {
                role.chronologie = [];
            }

            // Pour les taches
            role.tasks.forEach((inlineTasks, index) => {
                if (inlineTasks.some(element => element instanceof Task)) {
                    let lastIndexTask = inlineTasks.length - 1;
                    while (!(inlineTasks[lastIndexTask] instanceof Task)) {
                        lastIndexTask--;
                    }
                    inlineTasks.splice(lastIndexTask + 1, inlineTasks.length);
                } else {
                    role.tasks[index] = [];
                }
            });
        });
    }
    
    public sumUT(list: ((Step|null)|(Task|null))[]): number {
        let sum = 0;
        list.forEach(element => {
            if (element?.durationUnit == 'UT') {
                if (element.duration > 1) {
                    if (element.duration>=10) {
                        sum = sum + 10-1;
                    } else {
                        sum = sum + element.duration-1;
                    }
                }
            }
        });
        return sum;
    }
    
}
