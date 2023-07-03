import { Ressource } from "../../ressource/ressource";
import { Reward } from "../reward";

export class SkillReward extends Reward {

    constructor() {
        super('skill');
    }

    quantity: number = 1;
    skill!: Ressource;
}
