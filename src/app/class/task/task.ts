import { Character } from "../character/character";
import { Comment } from "../comment/comment";
import { LinkedFile } from "../linked-file/linked-file";
import { PrerequireRessource } from "../prerequires/prerequire-ressource/prerequire-ressource";
import { PrerequireTask } from "../prerequires/prerequire-task/prerequire-task";
import { Repeat } from "../repeat/repeat";
import { Ressource } from "../ressource/ressource";
import { Reward } from "../rewards/reward";
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

    name: string = '';
    typeUnity: string = 'getObject';
    objectQuantity: number = 1;
    object: Ressource | null = null;
    interactionName: string = '';
    character: Character | null = null;
    combineObjects: (Ressource | number | null)[][] = [[null,1],[null,1]]; // [0] = Ressource & [1] = quantity
    giveObjects: (Ressource | number | null)[][] = [[null,1]];
    receiveObjects: (Ressource | number | null)[][] = [[null,1]];
    other: string = '';
    role: string = ''; //role.intitule

    supplementaryRole: SupplementaryRole|null = null;
    interrupt: string = '';

    rewards: Reward[] = [];

    files: number[]  = [];

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
 
    public resetUnityContent(): void {
        this.object = null;
        this.objectQuantity = 1;
        this.character = null;
        this.combineObjects = [[null,1],[null,1]];
        this.giveObjects = [[null,1]];
        this.receiveObjects = [[null,1]];
        this.other = '';
        this.role = '';
        this.interactionName = '';
    }
}
