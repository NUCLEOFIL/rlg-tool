import { Character } from "../character/character";
import { Comment } from "../comment/comment";
import { Repeat } from "../repeat/repeat";
import { SupplementaryRole } from "../supplementary-role/supplementary-role";
import { Symbol } from "../symbol/symbol";

export class Task {

    type: string;   //peut être : normal / annexe / event / optionnal / final / repeat
    identifier: string = '';
    symbol: Symbol = new Symbol();
    objective: string = '';
    antecedents: Task[] = [];
    duration: number = 1;
    durationUnit: string = 'UT';
    comments: Comment[] = [];
    characters: Character[] = [];
    repeat: Repeat = new Repeat();

    supplementaryRole!: SupplementaryRole;
    interrupt: string = '';

    constructor(type: string) {
        this.type = type;
    }

    public changeType(type: string) {
        if (type == 'annexe') {
            this.type = type;
            this.symbol.color = '';
            this.symbol.symbol = '';
        } else {
            this.type = type;
        }
    }
}
