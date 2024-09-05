import { Character } from "../character/character";
import { GameContext } from "../game-context/game-context";
import { GameEducationnalObjective } from "../game-educationnal-objective/game-educationnal-objective";
import { Mission } from "../mission/mission";
import { Ressource } from "../ressource/ressource";
import { Comment } from "../comment/comment";
import { Trace } from "../trace/trace";
import { LinkedFile } from "../linked-file/linked-file";

export class Scenario {

    educationnalObjective: GameEducationnalObjective = new GameEducationnalObjective();
    context: GameContext = new GameContext();
    missions: Mission[] = [new Mission()];
    characters: Character[] = [];
    gameRules: string = '';
    ressources: Ressource[] = [];
    gameMovements: string = '';
    gameTutorial: string = '';
    gameEasterEggs: string = '';
    gameRanking: string = '';
    gameBadges: string = '';
    comments: Comment[] = [];
    projectName: string = '';
    tooltips: boolean = true;
    unity_isActive: boolean = false;
    tutorial_isActive: boolean = true;
    tutorial_phase: number = 1;
    tutorial_optionnalPhase: string = '';
    tutorial_phaseDone: boolean[] = []; 
    files: LinkedFile[] = [];
    actualFileID: number = 0;
    traces: Trace[] = [new Trace(0, 'new', undefined, undefined, 'all', 'Scenario')];
}