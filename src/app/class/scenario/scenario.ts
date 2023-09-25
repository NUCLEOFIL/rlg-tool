import { Character } from "../character/character";
import { GameContext } from "../game-context/game-context";
import { GameEducationnalObjective } from "../game-educationnal-objective/game-educationnal-objective";
import { Mission } from "../mission/mission";
import { Ressource } from "../ressource/ressource";
import { Comment } from "../comment/comment";
import { Trace } from "../trace/trace";

export class Scenario {

    educationnalObjective: GameEducationnalObjective = new GameEducationnalObjective();
    context: GameContext = new GameContext();
    missions: Mission[] = [new Mission()];
    characters: Character[] = [];
    gameRules: string = '';
    ressources: Ressource[] = [];
    comments: Comment[] = [];
    projectName: string = '';
    tooltips: boolean = true;
    traces: Trace[] = [new Trace(0, 'new', undefined, undefined, 'all', 'Scenario')];
}