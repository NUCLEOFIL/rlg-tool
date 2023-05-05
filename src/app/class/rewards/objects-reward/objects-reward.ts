import { Ressource } from "../../ressource/ressource";
import { Reward } from "../reward";

export class ObjectsReward implements Reward{
    objects: Ressource[] = [new Ressource()];
}
