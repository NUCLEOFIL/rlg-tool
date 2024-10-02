import { Role } from "../../role/role";
import { Reward } from "../reward";

export class QuestReward extends Reward {

    constructor() {
        super('quest');
    }

    intitule!: string;
    questName!: string;
}
