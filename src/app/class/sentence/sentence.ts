export abstract class Sentence {

    constructor(ID: number) {
        this.ID = ID;
    }

    ID: number = 0;
    value: string = '';
    results: [] = [];
    idDiscussion: number = 0;
    
}
