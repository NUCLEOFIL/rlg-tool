import { Character } from "../character/character";
import { Comment } from "../comment/comment";
import { Repeat } from "../repeat/repeat";
import { Symbol } from "../symbol/symbol";

export class Task {

    type: string;   //could be : normal / annexe / event
    identifier: string = '';
    symbol: Symbol = new Symbol();
    objective: string = '';
    antecedents: Task[] = [];
    duration: number = 1;
    durationUnite: string = 'UT';
    comments: Comment[] = [];
    character: Character = new Character();
    repeat: Repeat = new Repeat();

    constructor(type: string) {
        this.type = type;
    }

}
