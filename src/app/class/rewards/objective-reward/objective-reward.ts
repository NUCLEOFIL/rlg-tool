import { RoleEducationnalObjective } from "../../role-educationnal-objective/role-educationnal-objective";
import { Reward } from "../reward";

export class ObjectiveReward extends Reward {

    constructor() {
        super('objective');
    }

    objective!: RoleEducationnalObjective;
}
