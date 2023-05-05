import { Role } from "../../role/role";
import { Reward } from "../reward";

export class QuestReward implements Reward {
    quest!: Role;
}
