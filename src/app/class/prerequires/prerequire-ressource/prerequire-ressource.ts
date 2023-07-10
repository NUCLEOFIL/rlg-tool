import { Ressource } from "../../ressource/ressource";

export class PrerequireRessource {

    constructor(ressource?: Ressource) {
        if (ressource) {
            this.ressource = ressource;
        }
    }

    ressource!: Ressource;
    operator: string = '';
    quantity: number = 1;
}
