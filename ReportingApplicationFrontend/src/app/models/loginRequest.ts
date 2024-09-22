export class LoginRequest{
    userName: string;
    password: string;

    constructor(_userName: string, _password: string){
        this.userName = _userName;
        this.password = _password;
    }
}