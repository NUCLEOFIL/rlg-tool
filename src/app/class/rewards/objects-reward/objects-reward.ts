import { Ressource } from "../../ressource/ressource";
import { Reward } from "../reward";

export class ObjectsReward extends Reward{

    constructor() {
        super('objects');
    }

    objects: Ressource[] = [new Ressource()];
}
