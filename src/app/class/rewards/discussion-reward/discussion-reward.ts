import { Reward } from "../reward";

export class DiscussionReward extends Reward {

    constructor() {
        super('discussion');
    }

    discussionId: number = -1;
}
