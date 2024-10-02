import { CharacterReward } from "../rewards/character-reward/character-reward";
import { DiscussionReward } from "../rewards/discussion-reward/discussion-reward";
import { ObjectReward } from "../rewards/object-reward/object-reward";
import { QuestReward } from "../rewards/quest-reward/quest-reward";
import { Reward } from "../rewards/reward";
import { SkillReward } from "../rewards/skill-reward/skill-reward";

export class Response {

    constructor(ID: number) {
        this.ID = ID;
    }

    ID: number = 0;
    value: string = '';
    nextSentence: number = -1;
    idInterrogativeSentence: number = 0;
    rewards: Reward[] = [];
}
