export default class Option {
    name: string;
    points: number;
    uniqueId: number;
    
    constructor(name: string, points: number, uniqueId: number) {
        this.name = name;
        this.points = points;
        this.uniqueId = uniqueId;
    }
};