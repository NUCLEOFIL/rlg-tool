import { Character } from "../character/character";
import { Comment } from "../comment/comment";
import { PrerequireRessource } from "../prerequires/prerequire-ressource/prerequire-ressource";
import { PrerequireTask } from "../prerequires/prerequire-task/prerequire-task";
import { Repeat } from "../repeat/repeat";
import { Ressource } from "../ressource/ressource";
import { SupplementaryRole } from "../supplementary-role/supplementary-role";
import { Symbol } from "../symbol/symbol";

export class Task {

    type: string;   //peut être : normal / annexe / event / optionnal / final / repeat
    identifier: string = '';
    symbol: Symbol = new Symbol();
    objective: string = '';
    prerequireTasks: PrerequireTask[] = [];
    prerequireRessources: PrerequireRessource[] = [];
    duration: number = 1;
    durationUnit: string = 'UT';
    comments: Comment[] = [];
    characters: Character[] = [];
    repeat: Repeat = new Repeat();

    supplementaryRole!: SupplementaryRole;
    interrupt: string = '';

    rewardType: string = 'none'; //none / object / character / skill
    //rewardName: string = '';
    rewardQuantity: number = 1;
    reward: (Character | Ressource | null) = null;

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

    public resetReward(): void {
        this.reward = null;
        this.rewardQuantity = 1;
    }
}
