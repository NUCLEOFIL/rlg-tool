import { Role } from "../../role/role";
import { Reward } from "../reward";

export class QuestReward extends Reward {

    constructor() {
        super('quest');
    }

    indexQuest!: number; 
}
