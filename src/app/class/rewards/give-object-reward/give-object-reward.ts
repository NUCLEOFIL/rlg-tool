import { Character } from "../../character/character";
import { Ressource } from "../../ressource/ressource";
import { Reward } from "../reward";

export class GiveObjectReward extends Reward {

    constructor() {
        super('giveObject');
    }

    quantity: number = 1;
    object: Ressource = new Ressource();
    target: Character = new Character();
}
