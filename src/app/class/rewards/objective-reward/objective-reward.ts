import { Reward } from "../reward";

export class ObjectiveReward extends Reward {

    constructor() {
        super('objective');
    }

    name: string = '';
}
