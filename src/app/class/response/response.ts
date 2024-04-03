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

    addReward(): void {
        this.rewards.push(new ObjectReward());
        //this.scenario.traces.push(new Trace(this.scenario.traces.length, 'new', this.missionIndex, this.i, 'Reward_[' + this.role.rewards.length + ']', 'Role_[' + this.i + ']', '#9AD5EC', '*'));
    }

    changeRewardType(index: number, type: string): void {
        switch (type) {
            case 'quest': this.rewards[index] = new QuestReward();
                //this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[QuestReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
                break;
            case 'skill': this.rewards[index] = new SkillReward();
                //this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[SkillReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
                break;
            case 'character': this.rewards[index] = new CharacterReward();
                //this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[CharacterReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
                break;
            case 'object': this.rewards[index] = new ObjectReward();
                //this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[ObjectReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
                break;
            case 'discussion': this.rewards[index] = new DiscussionReward();
                //this.scenario.traces.push(new Trace(this.scenario.traces.length,'transform',this.missionIndex,this.i,'Reward_['+index+']_transform_into_[DiscussionReward]', 'Role_['+this.i+']', '#9AD5EC', '*'));
                break;
        }
    }

    removeReward(index: number): void {
        //const dialogRef = this.dialog.open(SuppressDialogComponent, { data: this.translate.instant('role_reward_delete') });
        //dialogRef.afterClosed().subscribe(result => {
            //if (result == true) {
                this.rewards.splice(index, 1);
                //this.scenario.traces.push(new Trace(this.scenario.traces.length, 'delete', this.missionIndex, this.i, 'Reward_[' + index + ']', 'Role_[' + this.i + ']', '#9AD5EC', '*'));
            //} else {
                //this.scenario.traces.push(new Trace(this.scenario.traces.length, 'cancel_delete', this.missionIndex, this.i, 'Reward_[' + index + ']', 'Role_[' + this.i + ']', '#9AD5EC', '*'));
            //}
        //});
    }

    getQuestReward(index: number): QuestReward {
        return this.rewards[index] as QuestReward;
    }

    getCharacterReward(index: number): CharacterReward {
        return this.rewards[index] as CharacterReward;
    }

    getSkillReward(index: number): SkillReward {
        return this.rewards[index] as SkillReward;
    }

    getObjectReward(index: number): ObjectReward {
        return this.rewards[index] as ObjectReward;
    }

    getDiscussionReward(index: number): DiscussionReward {
        return this.rewards[index] as DiscussionReward;
    }  

    changeQuestReward(roleIntitule: string, index: number, event: any) {
        let value: string = event.target.value;
        let reward = new QuestReward();
        reward.intitule = roleIntitule;
        reward.questName = value;
        this.rewards[index] = reward;
    }

}
