import { Comment } from "../comment/comment";

export class Step {

    description: string = '';
    duration: number = 1;
    durationUnit: string = 'UT';
    comments: Comment[] = [];
    files: number[] = [];
}
