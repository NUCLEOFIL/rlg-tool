import { Character } from "../../character/character";
import { Reward } from "../reward";

export class CharacterReward implements Reward {
    character!: Character;
}
