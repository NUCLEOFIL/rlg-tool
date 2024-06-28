import { Ressource } from "../../ressource/ressource";
import { Reward } from "../reward";

export class RandomObjectsReward extends Reward {

    constructor() {
        super('randomObjects');
    }

    repeatNumber: number = 1;
    minDroppedQuantities: number[] = [0];
    maxDroppedQuantities: number[] = [1];
    objects: (Ressource | undefined)[] = [undefined];
    dropPercentages: number[] = [0];

    addObject() {
        this.minDroppedQuantities.push(0);
        this.maxDroppedQuantities.push(1);
        this.objects.push(undefined);
        this.dropPercentages.push(0);
    }

    removeObject(index: number) {
        this.minDroppedQuantities.splice(index,1);
        this.maxDroppedQuantities.splice(index,1);
        this.objects.splice(index,1);
        this.dropPercentages.splice(index,1);
    }
}
