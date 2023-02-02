import { Character } from "../character/character";
import { GameContext } from "../game-context/game-context";
import { GameEducationnalObjective } from "../game-educationnal-objective/game-educationnal-objective";
import { Mission } from "../mission/mission";

export class Scenario {

    educationnalObjective: GameEducationnalObjective = new GameEducationnalObjective();
    context: GameContext = new GameContext();
    missions: Mission[] = [new Mission()];
    characters: Character[] = [];

}