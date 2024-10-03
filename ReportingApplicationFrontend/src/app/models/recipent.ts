export class Recipent{
    userId?: string | null;
    recipentName?: string | null;
    recipentColor?: string | null;

    constructor(_userId?: string | null, _recipentName?: string | null, _recipentColor?: string | null){
        this.userId = _userId;
        this.recipentName = _recipentName;
        this.recipentColor = _recipentColor;
    }
}