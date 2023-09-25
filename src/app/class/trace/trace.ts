export class Trace {
    sequence: number;
    timestamp: string;
    action: string;
    mission?: number;
    role?: number;
    case?: string;
    target?: string;
    color?: string;
    flag?: string;

    constructor(sequence: number, action: string, mission?: number, role?: number, Case?: string, target?: string, color?: string, flag?: string) {
        this.sequence = sequence;
        this.timestamp = new Date().toLocaleString('fr');
        this.action = action;
        this.mission = mission;
        this.role = role;
        this.case = Case;
        this.target = target;
        this.color = color;
        this.flag = flag;
    }
}
