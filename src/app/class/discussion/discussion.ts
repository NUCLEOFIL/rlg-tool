import { Character } from "../character/character";

export class Discussion {

    constructor(ID: number, character: Character, name: string) {
        this.ID = ID;
        this.character = character;
        this.name = name;
    }

    name: string = '';
    ID: number = 0;
    sentences: number[] = [];
    results: [] = [];
    firstSentenceID: number = -1;
    character: Character;
    isFirstDiscussion: boolean = false;
}
