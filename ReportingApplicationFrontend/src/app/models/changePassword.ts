export class ChangePassword{
    userId: string;
    password1: string;
    password2: string;

    constructor(_userId: string, _password1: string, _password2: string){
        this.userId = _userId;
        this.password1 = _password1;
        this.password2 = _password2;
    }
}