import { Character } from "../character/character";
import { Comment } from "../comment/comment";
import { Repeat } from "../repeat/repeat";
import { SupplementaryRole } from "../supplementary-role/supplementary-role";
import { Symbol } from "../symbol/symbol";

export class Task {

    type: string;   //peut être : normal / annexe / event / optionnal / final / repeater
    identifier: string = '';
    symbol: Symbol = new Symbol();
    objective: string = '';
    antecedents: Task[] = [];
    duration: number = 1;
    durationUnite: string = 'UT';
    comments: Comment[] = [];
    character: Character | null = null;
    repeat: Repeat = new Repeat();

    supplementaryRole: SupplementaryRole | null = null;
    interrupt: string = '';

    constructor(type: string) {
        this.type = type;
    }

}
