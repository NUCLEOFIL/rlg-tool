import { Character } from "../../character/character";
import { Reward } from "../reward";

export class CharacterReward extends Reward {

    constructor() {
        super('character');
    }

    character!: Character;
}
