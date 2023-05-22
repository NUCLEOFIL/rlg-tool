import { Ressource } from "../../ressource/ressource";
import { Reward } from "../reward";

export class SkillReward extends Reward {

    constructor() {
        super('skill');
    }

    skill!: Ressource;
}
