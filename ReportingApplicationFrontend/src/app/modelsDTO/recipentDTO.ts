export class RecipentDTO{
    id?: number | null;
    userId?: string | null;
    recipentName?: string | null;

    constructor(_id?: number | null, _userId?: string | null, _recipentName?: string | null){
        this.id = _id;
        this.userId = _userId;
        this.recipentName = _recipentName;
    }
}