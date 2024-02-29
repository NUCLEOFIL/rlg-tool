export class Response {

    constructor(ID: number) {
        this.ID = ID;
    }

    ID: number = 0;
    value: string = '';
    nextSentence: number = -1;
    results: [] = [];
    idInterrogativeSentence: number = 0;

}
