import { Ressource } from "../../ressource/ressource";
import { Reward } from "../reward";

export class ObjectReward extends Reward{

    constructor() {
        super('object');
    }

    quantity: number = 1;
    object: Ressource = new Ressource();
}
