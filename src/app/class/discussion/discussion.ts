import { Character } from "../character/character";
import { CharacterReward } from "../rewards/character-reward/character-reward";
import { DiscussionReward } from "../rewards/discussion-reward/discussion-reward";
import { ObjectReward } from "../rewards/object-reward/object-reward";
import { QuestReward } from "../rewards/quest-reward/quest-reward";
import { Reward } from "../rewards/reward";
import { SkillReward } from "../rewards/skill-reward/skill-reward";

export class Discussion {

    constructor(ID: number, character: Character, name: string) {
        this.ID = ID;
        this.character = character;
        this.name = name;
    }

    name: string = '';
    ID: number = 0;
    sentences: number[] = [];
    firstSentenceID: number = -1;
    character: Character;
    isFirstDiscussion: boolean = false;
    rewards: Reward[] = [];
}
