import Option from './Option';

export default class Model {
    name: string;
    points: number;
    options: Option[];
    origin: string;
    uniqueId: number;
    addedOptions: Option[];
    
    constructor(name: string, points: number, options: Option[], origin: string, uniqueId: number) {
        this.name = name;
        this.points = points;
        this.options = options;
        this.origin = origin;
        this.uniqueId = uniqueId;
        this.addedOptions = [];
    }
};